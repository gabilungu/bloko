import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ params, parent }) {
	const { lang } = await parent();
	const { slug } = params;
	const bloko = getBloko();
	const images = bloko.images;

	const allNodes = await bloko.crud.nodes.findAll();

	// Find node by slug (check both language versions)
	const node = allNodes.find(n => {
		if (!n.slug) return false;
		if (typeof n.slug === 'string') return n.slug === slug;
		return n.slug[lang] === slug || n.slug.en === slug;
	});

	if (!node) {
		error(404, 'Entry not found');
	}

	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();
	const templates = await bloko.crud.templates.findAll();
	const nodeTypes = await bloko.crud.nodeTypes.findAll();
	const template = templates.find(t => t.id === node._template);
	const nodeType = nodeTypes.find(nt => nt.id === node._node_type);

	// Check if this is a section (has children)
	const childNodes = allNodes
		.filter(n => n._parent === node.id)
		.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
		.map(child => ({
			id: child.id,
			code: child.code,
			title: t(child.title, lang),
			subtitle: t(child.subtitle, lang),
			slug: t(child.slug, lang)
		}));

	const isSection = childNodes.length > 0;

	// Get node contents organized by block
	const nodeContents = contents.filter(c => c._node === node.id);
	const templateBlocks = blocks.filter(b => b._template === template?.id);

	const contentBlocks = templateBlocks.map(block => {
		const content = nodeContents.find(c => c._block === block.id);
		return {
			code: block.code,
			title: t(block.title, lang),
			contentType: block.content_type,
			value: content ? t(content.value, lang) : null
		};
	}).filter(b => b.value);

	// Get related nodes (relations)
	const relations = await bloko.crud.nodeRelations.findAll();
	const relationTypes = await bloko.crud.nodeRelationTypes.findAll();

	const nodeRelations = relations
		.filter(r => r._from === node.id || r._to === node.id)
		.map(rel => {
			const relType = relationTypes.find(rt => rt.id === rel._node_relation_type);
			const isOutgoing = rel._from === node.id;
			const otherNodeId = isOutgoing ? rel._to : rel._from;
			const otherNode = allNodes.find(n => n.id === otherNodeId);

			if (!otherNode) return null;

			return {
				label: isOutgoing ? t(relType?.title, lang) : t(relType?.reverse_title, lang),
				node: {
					title: t(otherNode.title, lang),
					slug: t(otherNode.slug, lang)
				}
			};
		})
		.filter(Boolean);

	// Group relations by label
	const groupedRelations = nodeRelations.reduce((acc, rel) => {
		if (!acc[rel.label]) {
			acc[rel.label] = [];
		}
		acc[rel.label].push(rel.node);
		return acc;
	}, {});

	// Get parent for breadcrumb
	let parentNode = null;
	if (node._parent) {
		const parent = allNodes.find(n => n.id === node._parent);
		if (parent) {
			parentNode = {
				title: t(parent.title, lang),
				slug: t(parent.slug, lang)
			};
		}
	}

	// Get cover image URL
	let coverImageUrl = null;
	if (node._cover_image) {
		try {
			coverImageUrl = await images.getUrl(node._cover_image, { width: 800, format: 'webp' });
		} catch (e) {
			console.error('Failed to get cover image:', e);
		}
	}

	return {
		entry: {
			title: t(node.title, lang),
			subtitle: t(node.subtitle, lang),
			slug: t(node.slug, lang),
			nodeType: nodeType ? t(nodeType.title, lang) : null,
			coverImageUrl
		},
		isSection,
		childNodes,
		contentBlocks,
		relations: groupedRelations,
		parentNode
	};
}
