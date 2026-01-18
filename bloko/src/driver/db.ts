import pg from 'pg';

const { Pool } = pg;

export type DB = pg.Pool;

export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

let pool: DB | null = null;

export function connect(config: DBConfig): DB {
  pool = new Pool(config);
  return pool;
}

export function getPool(): DB {
  if (!pool) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return pool;
}

export async function disconnect(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
