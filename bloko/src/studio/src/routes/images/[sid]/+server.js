import { error, json } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function DELETE({ params }) {
	try {
		const sid = parseInt(params.sid, 10);

		if (isNaN(sid)) {
			throw error(400, 'Invalid image ID');
		}

		const bloko = getBloko();
		await bloko.images.delete(sid);

		return json({
			success: true,
			message: 'Image deleted successfully'
		});
	} catch (err) {
		console.error('Delete error:', err);

		if (err.status) {
			throw err;
		}

		throw error(500, err.message || 'Failed to delete image');
	}
}
