import { error, json } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			throw error(400, 'No file provided');
		}

		// Validate file type (only images, no SVG)
		const mimeType = file.type;
		if (!mimeType.startsWith('image/') || mimeType === 'image/svg+xml') {
			throw error(400, 'Only raster images are supported (JPG, PNG, WebP, GIF). SVG is not supported.');
		}

		// Read file as buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Call the bloko images upload function
		const bloko = getBloko();
		const result = await bloko.images.upload(buffer, file.name);

		return json({
			success: true,
			image: result,
			message: 'Image uploaded and processed successfully'
		});
	} catch (err) {
		console.error('Upload error:', err);

		if (err.status) {
			throw err;
		}

		throw error(500, err.message || 'Failed to upload image');
	}
}
