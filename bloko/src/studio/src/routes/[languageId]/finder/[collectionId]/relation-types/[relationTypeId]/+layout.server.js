import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:relation-types');

	const relationTypeId = params.relationTypeId;

	if (!relationTypeId) {
		throw error(400, 'Invalid relation type ID');
	}

	const bloko = getBloko();
	const relationType = await bloko.crud.nodeRelationTypes.findById(relationTypeId);

	if (!relationType) {
		throw error(404, 'Relation type not found');
	}

	// Verify relation type belongs to this root node tree
	const collectionId = params.collectionId;
	if (relationType._collection !== collectionId) {
		throw error(404, 'Relation type not found in this root node tree');
	}

	return {
		relationType
	};
}
