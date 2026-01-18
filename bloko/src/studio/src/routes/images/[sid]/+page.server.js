import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:images');

	const bloko = getBloko();
	const image = await bloko.crud.images.findById(params.sid);

	return {
		image
	};
}
