import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:collections');
	depends('app:nodes');
	depends('app:templates');
	depends('app:blocks');
	depends('app:relation-types');

	const { collectionId } = params;

	if (!collectionId) {
		throw error(400, 'Invalid collection ID');
	}

	const bloko = getBloko();
	const collection = await bloko.crud.collections.findById(collectionId);

	if (!collection) {
		throw error(404, 'Collection not found');
	}

	const [flatNodes, templates, nodeTypes, relationTypes] = await Promise.all([
		bloko.crud.nodes.findByCollection(collectionId),
		bloko.crud.templates.findByCollection(collectionId),
		bloko.crud.nodeTypes.findAll(),
		bloko.crud.nodeRelationTypes.findByCollection(collectionId)
	]);

	// Build hierarchical structure from flat list
	function buildHierarchy(nodes) {
		const nodeMap = new Map();
		const rootNodes = [];

		// First pass: create map of all nodes
		nodes.forEach(node => {
			nodeMap.set(node.id, { ...node, children: [] });
		});

		// Second pass: build hierarchy
		nodes.forEach(node => {
			const nodeWithChildren = nodeMap.get(node.id);
			if (node._parent) {
				const parent = nodeMap.get(node._parent);
				if (parent) {
					parent.children.push(nodeWithChildren);
				} else {
					// Parent doesn't exist in this collection, treat as root
					rootNodes.push(nodeWithChildren);
				}
			} else {
				// No parent, this is a root node
				rootNodes.push(nodeWithChildren);
			}
		});

		return rootNodes;
	}

	const nodes = buildHierarchy(flatNodes);

	// Load blocks if a template is selected
	const templateId = params.templateId ? params.templateId : null;
	let blocks = [];
	if (templateId) {
		blocks = await bloko.crud.blocks.findByTemplate(templateId);
	}

	return {
		collection,
		nodes,
		templates,
		nodeTypes,
		blocks,
		relationTypes
	};
}
