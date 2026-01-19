import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';
import * as blocksQueries from '$lib/server/queries/blocks.js';

export async function load({ params, depends }) {
	depends('app:blocks');

	const blockId = params.blockId;

	if (!blockId) {
		throw error(400, 'Invalid block ID');
	}

	const bloko = getBloko();
	const block = await bloko.crud.blocks.findById(blockId);

	if (!block) {
		throw error(404, 'Block not found');
	}

	// Get content types from database ENUM (keep using query for this)
	const contentTypes = await blocksQueries.getContentTypes();

	return {
		block,
		contentTypes
	};
}
