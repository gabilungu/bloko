import { createBloko } from '$driver/index.js';

// Use globalThis with a unique key to share instance across bundled chunks
const BLOKO_KEY = '__bloko_studio_instance__';

export function getBloko() {
	const existing = globalThis[BLOKO_KEY];
	if (existing) {
		return existing;
	}

	const dbConfig = {
		host: process.env.BLOKO_PG_HOST || 'localhost',
		port: parseInt(process.env.BLOKO_PG_PORT || '5432', 10),
		user: process.env.BLOKO_PG_USER || 'admin',
		password: process.env.BLOKO_PG_PASSWORD || 'password',
		database: process.env.BLOKO_PG_DATABASE || 'bloko',
	};

	console.log(`[Bloko Studio] Connecting to database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);

	// Default to MinIO in docker-compose
	const s3Config = {
		endpoint: process.env.BLOKO_S3_ENDPOINT || 'http://localhost:9000',
		region: process.env.BLOKO_S3_REGION || 'us-east-1',
		accessKeyId: process.env.BLOKO_S3_ACCESS_KEY || 'admin',
		secretAccessKey: process.env.BLOKO_S3_SECRET_KEY || 'password',
		bucket: process.env.BLOKO_S3_BUCKET || 'bloko',
	};

	const instance = createBloko({
		db: dbConfig,
		s3: s3Config,
	});

	globalThis[BLOKO_KEY] = instance;
	return instance;
}
