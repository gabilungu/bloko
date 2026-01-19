import { getBloko } from '$lib/server/bloko.js';
import { t } from '$lib/utils.js';

export async function load({ parent }) {
	const { lang } = await parent();
	const bloko = getBloko();
	const images = bloko.images;

	const collections = await bloko.crud.collections.findAll();
	const encyclopediaCol = collections.find(c => c.code === 'encyclopedia');

	if (!encyclopediaCol) {
		return { sections: [] };
	}

	const allNodes = await bloko.crud.nodes.findAll();
	const contents = await bloko.crud.contents.findAll();
	const blocks = await bloko.crud.blocks.findAll();
	const nodeTypes = await bloko.crud.nodeTypes.findAll();

	// Get root nodes (sections) from encyclopedia
	const rootNodes = allNodes.filter(
		n => n._collection === encyclopediaCol.id && !n._parent
	);

	const sections = await Promise.all(rootNodes.map(async (section) => {
		const nodeType = nodeTypes.find(nt => nt.id === section._node_type);
		const sectionContents = contents.filter(c => c._node === section.id);

		// Get description content
		let description = null;
		const descContent = sectionContents.find(c => {
			const block = blocks.find(b => b.id === c._block);
			return block?.code === 'description' || block?.code === 'introduction';
		});
		if (descContent) {
			description = t(descContent.value, lang);
		}

		// Get cover image URL
		let coverImageUrl = null;
		if (section._cover_image) {
			try {
				coverImageUrl = await images.getUrl(section._cover_image, { width: 200, height: 200, format: 'webp' });
			} catch (e) {
				// Image may have been deleted
			}
		}

		// Get children with their cover images
		const children = await Promise.all(
			allNodes
				.filter(n => n._parent === section.id)
				.map(async (child) => {
					let childCoverUrl = null;
					if (child._cover_image) {
						try {
							childCoverUrl = await images.getUrl(child._cover_image, { width: 96, height: 96, format: 'webp' });
						} catch (e) {
							// Image may have been deleted
						}
					}
					return {
						id: child.id,
						code: child.code,
						title: t(child.title, lang),
						subtitle: t(child.subtitle, lang),
						slug: t(child.slug, lang),
						coverImageUrl: childCoverUrl
					};
				})
		);

		return {
			id: section.id,
			code: section.code,
			title: t(section.title, lang),
			slug: t(section.slug, lang),
			nodeType: nodeType ? t(nodeType.title, lang) : null,
			description,
			coverImageUrl,
			children
		};
	}));

	return { sections };
}
