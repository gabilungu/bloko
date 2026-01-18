import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import { ListObjectsV2Command, DeleteObjectsCommand, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { getConfig, getS3Config } from '../config.js';
import { createS3Client } from '../../driver/s3/client.js';

const { Pool } = pg;

async function ensureS3Bucket() {
  const s3Config = getS3Config();
  if (!s3Config) {
    return;
  }

  const s3Client = createS3Client(s3Config);
  let bucketCreated = false;

  try {
    // Check if bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: s3Config.bucket }));
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === 'NotFound' || err.name === 'NoSuchBucket') {
      // Create the bucket
      console.log(`Creating S3 bucket "${s3Config.bucket}"...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: s3Config.bucket }));
      console.log(`S3 bucket "${s3Config.bucket}" created.`);
      bucketCreated = true;
    } else {
      console.warn('Warning: Could not check/create S3 bucket:', (error as Error).message);
      return;
    }
  }

  // Set public read policy for images (only on new buckets)
  if (bucketCreated) {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${s3Config.bucket}/*`],
          },
        ],
      };

      await s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: s3Config.bucket,
          Policy: JSON.stringify(policy),
        })
      );
      console.log(`S3 bucket "${s3Config.bucket}" configured for public read access.`);
    } catch (error) {
      console.warn('Warning: Could not set bucket policy:', (error as Error).message);
    }
  }
}

async function clearS3Bucket() {
  const s3Config = getS3Config();
  if (!s3Config) {
    return;
  }

  // Ensure bucket exists first
  await ensureS3Bucket();

  console.log(`Clearing S3 bucket "${s3Config.bucket}"...`);
  const s3Client = createS3Client(s3Config);

  try {
    // List and delete all objects in batches
    let continuationToken: string | undefined;
    let totalDeleted = 0;

    do {
      const listResponse = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: s3Config.bucket,
          ContinuationToken: continuationToken,
        })
      );

      const objects = listResponse.Contents;
      if (objects && objects.length > 0) {
        await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: s3Config.bucket,
            Delete: {
              Objects: objects.map((obj) => ({ Key: obj.Key })),
            },
          })
        );
        totalDeleted += objects.length;
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    if (totalDeleted > 0) {
      console.log(`Deleted ${totalDeleted} objects from S3.`);
    } else {
      console.log('S3 bucket was already empty.');
    }
  } catch (error) {
    console.warn('Warning: Could not clear S3 bucket:', (error as Error).message);
  }
}

export async function reinit() {
  const config = getConfig();
  const targetDb = config.database;

  // Clear S3 bucket first (creates if doesn't exist)
  await clearS3Bucket();

  // Connect to default 'postgres' database to drop/create the target database
  const adminPool = new Pool({
    ...config,
    database: 'postgres',
  });

  console.log(`Connecting to ${config.host}:${config.port}...`);

  try {
    // Check if target database exists
    const dbCheck = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb]
    );

    if (dbCheck.rows.length > 0) {
      // Terminate existing connections
      console.log(`Terminating connections to "${targetDb}"...`);
      await adminPool.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = $1 AND pid <> pg_backend_pid()
      `, [targetDb]);

      // Drop the database
      console.log(`Dropping database "${targetDb}"...`);
      await adminPool.query(`DROP DATABASE "${targetDb}"`);
    }

    // Create the database
    console.log(`Creating database "${targetDb}"...`);
    await adminPool.query(`CREATE DATABASE "${targetDb}"`);
  } finally {
    await adminPool.end();
  }

  // Connect to the new database and create schema
  const pool = new Pool(config);

  try {
    // Read and execute schema SQL
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schemaPath = join(__dirname, '..', 'sql', 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');

    console.log('Creating schema...');
    await pool.query(schemaSql);

    console.log(`Database "${targetDb}" reinitialized successfully.`);
  } finally {
    await pool.end();
  }
}
