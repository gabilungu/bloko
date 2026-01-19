import { error } from '@sveltejs/kit';
import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ params, parent }) {
	const { lang } = await parent();
	const { slug } = params;
	const bloko = getBloko();

	const collections = await bloko.crud.collections.findAll();
	const articlesCol = collections.find(c => c.code === 'articles');

	if (!articlesCol) {
		error(404, 'Articles collection not found');
	}

	const allNodes = await bloko.crud.nodes.findAll();

	// Find article by slug
	const articleNode = allNodes.find(n => {
		if (n._collection !== articlesCol.id) return false;
		if (!n.slug) return false;
		if (typeof n.slug === 'string') return n.slug === slug;
		return n.slug[lang] === slug || n.slug.en === slug;
	});

	if (!articleNode) {
		error(404, 'Article not found');
	}

	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();

	const nodeContents = contents.filter(c => c._node === articleNode.id);

	let summary = null;
	let body = null;

	for (const content of nodeContents) {
		const block = blocks.find(b => b.id === content._block);
		if (block?.code === 'summary') {
			summary = t(content.value, lang);
		}
		if (block?.code === 'body') {
			body = t(content.value, lang);
		}
	}

	return {
		article: {
			title: t(articleNode.title, lang),
			subtitle: t(articleNode.subtitle, lang),
			summary,
			body
		}
	};
}
