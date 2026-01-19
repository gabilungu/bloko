import { getBloko } from '$lib/server/bloko.js';

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
	depends('app:images');

	const bloko = getBloko();
	const image = await bloko.crud.images.findById(params.sid);

	// If image has a node owner, fetch the node info for the link
	let ownerNode = null;
	let ownerNodePath = null;
	if (image?._node) {
		ownerNode = await bloko.crud.nodes.findById(image._node);
		if (ownerNode) {
			ownerNodePath = await buildNodePath(bloko, ownerNode.id);
		}
	}

	return {
		image,
		ownerNode,
		ownerNodePath
	};
}
