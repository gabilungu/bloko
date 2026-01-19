import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:collections');

	const bloko = getBloko();
	const collections = await bloko.crud.collections.findAll();

	return {
		collections
	};
}
