import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import { CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getConfig, getS3Config } from '../config.js';
import { createS3Client } from '../../driver/s3/client.js';

const { Pool } = pg;

async function ensureS3Bucket() {
  const s3Config = getS3Config();
  if (!s3Config) {
    return;
  }

  const s3Client = createS3Client(s3Config);

  try {
    // Check if bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: s3Config.bucket }));
    console.log(`S3 bucket "${s3Config.bucket}" already exists.`);
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === 'NotFound' || err.name === 'NoSuchBucket') {
      // Create the bucket
      console.log(`Creating S3 bucket "${s3Config.bucket}"...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: s3Config.bucket }));
      console.log(`S3 bucket "${s3Config.bucket}" created.`);
    } else {
      console.warn('Warning: Could not check/create S3 bucket:', (error as Error).message);
    }
  }
}

export async function init() {
  const config = getConfig();
  const targetDb = config.database;

  // Connect to default 'postgres' database to create the target database
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
      throw new Error(`Database "${targetDb}" already exists. Use "bloko reinit" to drop and recreate.`);
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

    console.log(`Database "${targetDb}" initialized successfully.`);
  } finally {
    await pool.end();
  }

  // Ensure S3 bucket exists
  await ensureS3Bucket();
}
