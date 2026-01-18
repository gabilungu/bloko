import { query } from '$app/server';
import { getBloko } from '$lib/server/bloko.js';

export const createLanguage = query('unchecked', ({ id, title, sort }) => {
	const bloko = getBloko();
	return bloko.crud.languages.create({ id, title, sort });
});

export const updateLanguage = query('unchecked', ({ id, updates }) => {
	const bloko = getBloko();
	return bloko.crud.languages.update(id, updates);
});

export const deleteLanguage = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.languages.delete(id);
});
