import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();

	const collections = await bloko.crud.collections.findAll();
	const articlesCol = collections.find(c => c.code === 'articles');

	if (!articlesCol) {
		return { articles: [] };
	}

	const allNodes = await bloko.crud.nodes.findAll();
	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();

	const articleNodes = allNodes.filter(n => n._collection === articlesCol.id);

	const articles = articleNodes.map(node => {
		const nodeContents = contents.filter(c => c._node === node.id);
		const summaryContent = nodeContents.find(c => {
			const block = blocks.find(b => b.id === c._block);
			return block?.code === 'summary';
		});

		return {
			id: node.id,
			title: t(node.title, lang),
			subtitle: t(node.subtitle, lang),
			slug: t(node.slug, lang),
			summary: summaryContent ? t(summaryContent.value, lang) : null
		};
	});

	return { articles };
}
