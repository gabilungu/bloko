import { query } from '$app/server';
import { getBloko } from '$lib/server/bloko.js';

export const deleteImage = query('unchecked', ({ sid }) => {
	const bloko = getBloko();
	return bloko.images.delete(sid);
});
