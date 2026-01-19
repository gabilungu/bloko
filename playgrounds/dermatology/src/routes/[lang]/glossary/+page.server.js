import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();

	const collections = await bloko.crud.collections.findAll();
	const glossaryCol = collections.find(c => c.code === 'glossary');

	if (!glossaryCol) {
		return { terms: [] };
	}

	const allNodes = await bloko.crud.nodes.findAll();
	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();

	const termNodes = allNodes.filter(n => n._collection === glossaryCol.id);

	const terms = termNodes.map(node => {
		const nodeContents = contents.filter(c => c._node === node.id);
		const definitionContent = nodeContents.find(c => {
			const block = blocks.find(b => b.id === c._block);
			return block?.code === 'definition';
		});

		return {
			id: node.id,
			title: t(node.title, lang),
			subtitle: t(node.subtitle, lang),
			definition: definitionContent ? t(definitionContent.value, lang) : null
		};
	}).sort((a, b) => a.title.localeCompare(b.title));

	// Group by first letter
	const grouped = terms.reduce((acc, term) => {
		const letter = term.title[0].toUpperCase();
		if (!acc[letter]) {
			acc[letter] = [];
		}
		acc[letter].push(term);
		return acc;
	}, {});

	return { grouped, terms };
}
