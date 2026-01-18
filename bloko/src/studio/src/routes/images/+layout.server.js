import { getBloko } from '$lib/server/bloko.js';

export async function load({ depends }) {
	depends('app:images');

	const bloko = getBloko();
	const allImages = await bloko.crud.images.findAll();
	const images = allImages.slice(0, 100);

	// Construct S3 base URL for image previews (shared S3 config from env)
	const endpoint = process.env.BLOKO_S3_ENDPOINT || '';
	const bucket = process.env.BLOKO_S3_BUCKET || '';
	const forcePathStyle = process.env.BLOKO_S3_FORCE_PATH_STYLE === 'true';

	const s3BaseUrl = forcePathStyle
		? `${endpoint}/${bucket}`
		: endpoint;

	return {
		images,
		s3BaseUrl
	};
}
