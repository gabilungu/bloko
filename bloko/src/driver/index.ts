import { connect, disconnect, type DB, type DBConfig } from './db.js';
import { createCrud, type Crud } from './crud/index.js';
import { createApi, type Api } from './api/index.js';
import { createS3Client, createImageService, type S3Config, type ImageService } from './s3/index.js';

export const VERSION = '0.0.23';

export interface BlokoConfig {
  db: DBConfig;
  s3?: S3Config;
}

export interface ConnectionInfo {
  pg: {
    host: string;
    port: number;
    database: string;
  };
  s3: {
    endpoint: string;
    region: string;
    bucket: string;
  } | null;
}

export interface Bloko extends Api {
  db: DB;
  crud: Crud;
  images?: ImageService;
  disconnect: () => Promise<void>;
  connectionInfo: () => ConnectionInfo;
}

export function createBloko(config: BlokoConfig): Bloko {
  const db = connect(config.db);
  const crud = createCrud(db);
  const api = createApi(crud);

  let images: ImageService | undefined;

  if (config.s3) {
    const s3Client = createS3Client(config.s3);
    images = createImageService(s3Client, config.s3, crud);
  }

  const connectionInfo = (): ConnectionInfo => ({
    pg: {
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
    },
    s3: config.s3 ? {
      endpoint: config.s3.endpoint,
      region: config.s3.region,
      bucket: config.s3.bucket,
    } : null,
  });

  return {
    db,
    crud,
    ...api,  // API (nodes, collections)
    images,
    disconnect,
    connectionInfo,
  };
}

// Re-export types
export * from './types.js';
export type { DB, DBConfig } from './db.js';
export type { Crud } from './crud/index.js';
export type { Api, NodesApi, NodeWithContents, ContentItem, TreeNode, FindByPathResult } from './api/index.js';
export type { CollectionsApi, CollectionWithNavigation, NavNode } from './api/index.js';
export type { S3Config, ImageService, VariantConfig, UploadResult } from './s3/index.js';
