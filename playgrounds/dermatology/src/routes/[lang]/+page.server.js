import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();

	// Get hero content from 'general' collection
	const allNodes = await bloko.crud.nodes.findAll();
	const heroNode = allNodes.find(n => n.code === 'homepage-hero');

	let hero = null;
	if (heroNode) {
		const contents = await bloko.crud.contents.findAll();
		const heroContents = contents.filter(c => c._node === heroNode.id);
		const blocks = await bloko.crud.blocks.findAll();

		hero = {
			headline: null,
			subheadline: null,
			ctaLink: null
		};

		for (const content of heroContents) {
			const block = blocks.find(b => b.id === content._block);
			if (block?.code === 'headline') hero.headline = t(content.value, lang);
			if (block?.code === 'subheadline') hero.subheadline = t(content.value, lang);
			if (block?.code === 'cta-link') hero.ctaLink = `/${lang}${t(content.value, lang)}`;
		}
	}

	// Get featured conditions (first 3 from encyclopedia)
	const collections = await bloko.crud.collections.findAll();
	const encyclopediaCol = collections.find(c => c.code === 'encyclopedia');
	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();

	let featuredConditions = [];
	if (encyclopediaCol) {
		const conditionsSection = allNodes.find(
			n => n._collection === encyclopediaCol.id && n.code === 'conditions'
		);

		if (conditionsSection) {
			const childNodes = allNodes.filter(n => n._parent === conditionsSection.id).slice(0, 3);

			featuredConditions = childNodes.map(node => {
				const nodeContents = contents.filter(c => c._node === node.id);
				const overviewContent = nodeContents.find(c => {
					const block = blocks.find(b => b.id === c._block);
					return block?.code === 'overview';
				});

				return {
					id: node.id,
					code: node.code,
					title: t(node.title, lang),
					subtitle: t(node.subtitle, lang),
					slug: t(node.slug, lang),
					overview: overviewContent ? t(overviewContent.value, lang) : null
				};
			});
		}
	}

	// Get recent articles (first 3)
	const articlesCol = collections.find(c => c.code === 'articles');
	let recentArticles = [];

	if (articlesCol) {
		const articleNodes = allNodes
			.filter(n => n._collection === articlesCol.id)
			.slice(0, 3);

		recentArticles = articleNodes.map(node => {
			const nodeContents = contents.filter(c => c._node === node.id);
			const summaryContent = nodeContents.find(c => {
				const block = blocks.find(b => b.id === c._block);
				return block?.code === 'summary';
			});

			return {
				id: node.id,
				code: node.code,
				title: t(node.title, lang),
				subtitle: t(node.subtitle, lang),
				slug: t(node.slug, lang),
				summary: summaryContent ? t(summaryContent.value, lang) : null
			};
		});
	}

	return {
		hero,
		featuredConditions,
		recentArticles
	};
}
