import { error, json } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function POST({ request }) {
	try {
		const { base64Data, fileName, mimeType, nodeId } = await request.json();

		if (!base64Data || !fileName) {
			throw error(400, 'Missing base64Data or fileName');
		}

		// Require nodeId - images must belong to a node
		if (!nodeId) {
			throw error(400, 'Missing nodeId - images must belong to a node');
		}

		// Validate file type (only images, no SVG)
		if (!mimeType?.startsWith('image/') || mimeType === 'image/svg+xml') {
			throw error(400, 'Only raster images are supported (JPG, PNG, WebP, GIF). SVG is not supported.');
		}

		// Convert base64 to buffer
		const buffer = Buffer.from(base64Data, 'base64');

		// Call the bloko images upload function with nodeId
		const bloko = getBloko();
		const result = await bloko.images.upload(buffer, fileName, nodeId);

		return json({
			success: true,
			image: result.image,
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
