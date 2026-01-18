import type { DBConfig } from '../driver/db.js';
import type { S3Config } from '../driver/s3/client.js';

export function getConfig(): DBConfig {
  const password = process.env['BLOKO_PG_PASSWORD'];
  if (!password) {
    throw new Error('BLOKO_PG_PASSWORD environment variable is required');
  }

  return {
    host: process.env['BLOKO_PG_HOST'] ?? 'localhost',
    port: parseInt(process.env['BLOKO_PG_PORT'] ?? '5432', 10),
    database: process.env['BLOKO_PG_DATABASE'] ?? 'bloko',
    user: process.env['BLOKO_PG_USER'] ?? 'postgres',
    password,
  };
}

export function getS3Config(): S3Config | null {
  const bucket = process.env['BLOKO_S3_BUCKET'];
  if (!bucket) {
    return null;
  }

  return {
    endpoint: process.env['BLOKO_S3_ENDPOINT'] ?? '',
    region: process.env['BLOKO_S3_REGION'] ?? 'us-east-1',
    bucket,
    accessKeyId: process.env['BLOKO_S3_ACCESS_KEY'] ?? '',
    secretAccessKey: process.env['BLOKO_S3_SECRET_KEY'] ?? '',
  };
}
