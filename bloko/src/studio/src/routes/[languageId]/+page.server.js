import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const {  languageId } = params;
	throw redirect(302, `/${languageId}/finder`);
}
