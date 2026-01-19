import { getBloko } from '$lib/server/bloko.js';

export async function load({ depends }) {
	depends('app:languages');
	const bloko = getBloko();
	const languages = await bloko.crud.languages.findAll();
	return { languages };
}
