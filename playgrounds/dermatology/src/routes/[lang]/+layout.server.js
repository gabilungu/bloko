import { error } from '@sveltejs/kit';

const SUPPORTED_LANGS = ['en', 'ro'];

export async function load({ params }) {
	const { lang } = params;

	if (!SUPPORTED_LANGS.includes(lang)) {
		error(404, 'Language not supported');
	}

	return {
		lang
	};
}
