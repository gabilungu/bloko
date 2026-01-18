import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function load({ params }) {
	const { languageId } = params;

	const bloko = getBloko();
	const languages = await bloko.crud.languages.findAll();
	const language = await bloko.crud.languages.findById(languageId);

	if (!language) {
		throw error(404, 'Language not found');
	}

	return {
		languages: languages.map(l => l.id),
		languageId: language.id
	};
}
