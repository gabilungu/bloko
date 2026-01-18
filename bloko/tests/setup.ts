// vitest test helpers are used in crud.test.ts
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connect, disconnect, type DB } from '../src/driver/db.js';
import { createCrud, type Crud } from '../src/driver/crud/index.js';

const { Pool } = pg;

const TEST_DB = 'bloko_test';

const config = {
  host: process.env['BLOKO_HOST'] ?? 'localhost',
  port: parseInt(process.env['BLOKO_PORT'] ?? '5432', 10),
  user: process.env['BLOKO_USER'] ?? 'admin',
  password: process.env['BLOKO_PASSWORD'] ?? 'password',
  database: TEST_DB,
};

let db: DB;
let crud: Crud;

export function getDb() {
  return db;
}

export function getCrud() {
  return crud;
}

export async function setupTestDatabase() {
  // Connect to postgres database to create test database
  const adminPool = new Pool({
    ...config,
    database: 'postgres',
  });

  try {
    // Drop test database if exists
    await adminPool.query(`DROP DATABASE IF EXISTS "${TEST_DB}"`);
    // Create test database
    await adminPool.query(`CREATE DATABASE "${TEST_DB}"`);
  } finally {
    await adminPool.end();
  }

  // Connect to test database and create schema
  const testPool = new Pool(config);

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schemaPath = join(__dirname, '..', 'src', 'cli', 'sql', 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');
    await testPool.query(schemaSql);
  } finally {
    await testPool.end();
  }

  // Initialize db and crud
  db = connect(config);
  crud = createCrud(db);
}

export async function teardownTestDatabase() {
  await disconnect();

  // Drop test database
  const adminPool = new Pool({
    ...config,
    database: 'postgres',
  });

  try {
    // Terminate connections
    await adminPool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${TEST_DB}'
      AND pid <> pg_backend_pid()
    `);
    await adminPool.query(`DROP DATABASE IF EXISTS "${TEST_DB}"`);
  } finally {
    await adminPool.end();
  }
}

export async function cleanTables() {
  // Delete in correct order due to foreign keys
  await db.query('DELETE FROM node_relations');
  await db.query('DELETE FROM node_relation_types');
  await db.query('DELETE FROM contents');
  await db.query('DELETE FROM image_variants');
  await db.query('DELETE FROM images');
  await db.query('DELETE FROM nodes');
  await db.query('DELETE FROM blocks');
  await db.query('DELETE FROM templates');
  await db.query('DELETE FROM node_types');
  await db.query('DELETE FROM languages');
  await db.query('DELETE FROM collections');
}
