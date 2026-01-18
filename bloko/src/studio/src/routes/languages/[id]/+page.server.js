import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:languages');

	const bloko = getBloko();
	const language = await bloko.crud.languages.findById(params.id);

	return {
		language,
	};
}
