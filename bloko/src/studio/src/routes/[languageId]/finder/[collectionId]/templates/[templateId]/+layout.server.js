import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:templates');

	const templateId = params.templateId;

	if (!templateId) {
		throw error(400, 'Invalid template ID');
	}

	const bloko = getBloko();
	const template = await bloko.crud.templates.findById(templateId);

	if (!template) {
		throw error(404, 'Template not found');
	}

	// Verify template belongs to this root node tree
	const collectionId = params.collectionId;
	if (template._collection !== collectionId) {
		throw error(404, 'Template not found in this root node tree');
	}

	return {
		template
	};
}
