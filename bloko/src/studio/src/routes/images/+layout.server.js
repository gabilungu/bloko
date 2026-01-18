import { getBloko } from '$lib/server/bloko.js';

export async function load({ depends }) {
	depends('app:images');

	const bloko = getBloko();
	const allImages = await bloko.crud.images.findAll();
	const images = allImages.slice(0, 100);

	// Construct S3 base URL for image previews (use same defaults as bloko.js)
	const endpoint = process.env.BLOKO_S3_ENDPOINT || 'http://localhost:9000';
	const bucket = process.env.BLOKO_S3_BUCKET || 'bloko';

	// Use path style for MinIO compatibility (endpoint/bucket/key)
	const s3BaseUrl = `${endpoint}/${bucket}`;

	return {
		images,
		s3BaseUrl
	};
}
