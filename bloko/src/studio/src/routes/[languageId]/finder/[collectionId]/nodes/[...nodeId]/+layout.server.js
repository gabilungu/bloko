import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';
import * as contentsQueries from '$lib/server/queries/contents.js';

export async function load({ params, depends }) {
	depends('app:nodes');

	const nodeIdPath = params.nodeId;

	if (!nodeIdPath) {
		throw error(400, 'Invalid node path');
	}

	// Get the last segment from the path (e.g., "id1/id2/id3" -> "id3")
	const segments = nodeIdPath.split('/');
	const lastNodeId = segments[segments.length - 1];

	if (!lastNodeId) {
		throw error(400, 'Invalid node ID');
	}

	const bloko = getBloko();
	const node = await bloko.crud.nodes.findById(lastNodeId);

	if (!node) {
		throw error(404, 'Node not found');
	}

	// Verify node belongs to this collection
	const collectionId = params.collectionId;
	if (node._collection !== collectionId) {
		throw error(404, 'Node not found in this collection');
	}

	const nodeTypes = await bloko.crud.nodeTypes.findAll();

	// Get blocks for the node's template (if assigned)
	let blocks = [];
	let contents = [];
	if (node._template) {
		blocks = await bloko.crud.blocks.findByTemplate(node._template);
		// Use contents query for complex normalization logic
		contents = await contentsQueries.getNodeContents(lastNodeId, node._template);
	}

	// Get relation types for the collection
	const relationTypes = await bloko.crud.nodeRelationTypes.findByCollection(collectionId);

	// Get outgoing and incoming relations for this node
	const outgoingRelations = await bloko.crud.nodeRelations.findByFrom(lastNodeId);
	const incomingRelations = await bloko.crud.nodeRelations.findByTo(lastNodeId);

	return {
		node,
		nodeTypes,
		blocks,
		contents,
		relationTypes,
		outgoingRelations,
		incomingRelations
	};
}
