import { createBloko } from 'bloko';

// Singleton instance
let blokoInstance = null;

export function getBloko() {
	if (blokoInstance) {
		return blokoInstance;
	}

	const dbConfig = {
		host: process.env.BLOKO_PG_HOST || 'localhost',
		port: parseInt(process.env.BLOKO_PG_PORT || '5432', 10),
		user: process.env.BLOKO_PG_USER || 'admin',
		password: process.env.BLOKO_PG_PASSWORD || 'password',
		database: process.env.BLOKO_PG_DATABASE || 'bloko',
	};

	const s3Config = {
		endpoint: process.env.BLOKO_S3_ENDPOINT || 'http://localhost:9000',
		region: process.env.BLOKO_S3_REGION || 'us-east-1',
		accessKeyId: process.env.BLOKO_S3_ACCESS_KEY || 'admin',
		secretAccessKey: process.env.BLOKO_S3_SECRET_KEY || 'password',
		bucket: process.env.BLOKO_S3_BUCKET || 'bloko',
	};

	blokoInstance = createBloko({
		db: dbConfig,
		s3: s3Config,
	});

	return blokoInstance;
}
