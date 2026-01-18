import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import { getConfig } from '../config.js';

const { Pool } = pg;

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
}
