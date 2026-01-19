import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();

	const collections = await bloko.crud.collections.findAll();
	const generalCol = collections.find(c => c.code === 'general');

	if (!generalCol) {
		return { about: null };
	}

	const allNodes = await bloko.crud.nodes.findAll();
	const aboutNode = allNodes.find(n => n._collection === generalCol.id && n.code === 'about');

	if (!aboutNode) {
		return { about: null };
	}

	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();

	const nodeContents = contents.filter(c => c._node === aboutNode.id);
	let content = null;

	const contentContent = nodeContents.find(c => {
		const block = blocks.find(b => b.id === c._block);
		return block?.code === 'content';
	});

	if (contentContent) {
		content = t(contentContent.value, lang);
	}

	return {
		about: {
			title: t(aboutNode.title, lang),
			subtitle: t(aboutNode.subtitle, lang),
			content
		}
	};
}
