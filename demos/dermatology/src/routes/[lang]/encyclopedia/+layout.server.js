import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();

	const collections = await bloko.crud.collections.findAll();
	const encyclopediaCol = collections.find(c => c.code === 'encyclopedia');

	if (!encyclopediaCol) {
		return { tree: [] };
	}

	const allNodes = await bloko.crud.nodes.findAll();
	const encyclopediaNodes = allNodes.filter(n => n._collection === encyclopediaCol.id);

	// Build tree structure recursively
	function buildTree(parentId) {
		return encyclopediaNodes
			.filter(n => n._parent === parentId)
			.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
			.map(node => ({
				id: node.id,
				code: node.code,
				title: t(node.title, lang),
				slug: t(node.slug, lang),
				children: buildTree(node.id)
			}));
	}

	// Get root nodes (no parent)
	const tree = encyclopediaNodes
		.filter(n => !n._parent)
		.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
		.map(node => ({
			id: node.id,
			code: node.code,
			title: t(node.title, lang),
			slug: t(node.slug, lang),
			children: buildTree(node.id)
		}));

	return { tree };
}
