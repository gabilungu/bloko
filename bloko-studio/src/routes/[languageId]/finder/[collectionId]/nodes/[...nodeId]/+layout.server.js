import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';
import * as contentsQueries from '$lib/server/queries/contents.js';

// Build the full ancestor path for a node (from root to node)
async function buildNodePath(bloko, nodeId) {
	const path = [];
	let currentId = nodeId;

	while (currentId) {
		path.unshift(currentId);
		const node = await bloko.crud.nodes.findById(currentId);
		currentId = node?._parent || null;
	}

	return path.join('/');
}

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

	// Get outgoing and incoming relations for this node with joined data
	const outgoingRelationsRaw = await bloko.crud.nodeRelations.findByFrom(lastNodeId);
	const incomingRelationsRaw = await bloko.crud.nodeRelations.findByTo(lastNodeId);

	// Enrich outgoing relations with relation type title and target node info
	const outgoingRelations = await Promise.all(
		outgoingRelationsRaw.map(async (rel) => {
			const relType = relationTypes.find((rt) => rt.id === rel._node_relation_type);
			const toNode = await bloko.crud.nodes.findById(rel._to);
			const toNodePath = toNode ? await buildNodePath(bloko, toNode.id) : '';
			return {
				...rel,
				relation_type_code: relType?.code || 'unknown',
				relation_type_title: relType?.title || {},
				to_node_id: toNode?.id,
				to_node_collection: toNode?._collection,
				to_node_path: toNodePath,
				to_node_code: toNode?.code || toNode?.title?.en || 'unknown'
			};
		})
	);

	// Enrich incoming relations with relation type reverse_title and source node info
	const incomingRelations = await Promise.all(
		incomingRelationsRaw.map(async (rel) => {
			const relType = relationTypes.find((rt) => rt.id === rel._node_relation_type);
			const fromNode = await bloko.crud.nodes.findById(rel._from);
			const fromNodePath = fromNode ? await buildNodePath(bloko, fromNode.id) : '';
			return {
				...rel,
				relation_type_code: relType?.code || 'unknown',
				relation_type_title: relType?.reverse_title || relType?.title || {},
				from_node_id: fromNode?.id,
				from_node_collection: fromNode?._collection,
				from_node_path: fromNodePath,
				from_node_code: fromNode?.code || fromNode?.title?.en || 'unknown'
			};
		})
	);

	// Get images owned by this node for the picker
	const images = await bloko.crud.images.findByNode(lastNodeId);
	let coverImageUrl = null;
	if (node._cover_image) {
		try {
			coverImageUrl = await bloko.images.getUrl(node._cover_image, { width: 400, format: 'webp' });
		} catch (e) {
			// Image may have been deleted
		}
	}

	// Build image list with URLs for picker
	const imageList = await Promise.all(
		images.map(async (img) => ({
			id: img.id,
			file_name: img.file_name,
			url: await bloko.images.getUrl(img.id, { width: 200, format: 'webp' })
		}))
	);

	return {
		node,
		nodeTypes,
		blocks,
		contents,
		relationTypes,
		outgoingRelations,
		incomingRelations,
		images: imageList,
		coverImageUrl
	};
}
