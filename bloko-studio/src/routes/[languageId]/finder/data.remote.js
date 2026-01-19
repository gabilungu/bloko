import { query } from '$app/server';
import { getBloko } from '$lib/server/bloko.js';
import * as contentsQueries from '$lib/server/queries/contents.js';

// Collections
export const createCollection = query('unchecked', ({ code, notes }) => {
	const bloko = getBloko();
	return bloko.crud.collections.create({ code, notes });
});

export const updateCollectionSort = query('unchecked', async ({ updates }) => {
	const bloko = getBloko();
	for (const { id, sort } of updates) {
		await bloko.crud.collections.update(id, { sort });
	}
});

export const updateRootNode = query('unchecked', ({ id, code, notes }) => {
	const bloko = getBloko();
	return bloko.crud.collections.update(id, { code, notes });
});

export const deleteRootNode = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.collections.delete(id);
});

// Nodes
export const createNode = query('unchecked', ({ code, notes, _collection, _node_type, _parent }) => {
	const bloko = getBloko();
	return bloko.crud.nodes.create({ code, notes, _collection, _node_type, _parent });
});

export const updateNode = query('unchecked', ({ id, code, notes, _template, _node_type, title, subtitle, slug, _cover_image, _images }) => {
	const bloko = getBloko();
	return bloko.crud.nodes.update(id, { code, notes, _template, _node_type, title, subtitle, slug, _cover_image, _images });
});

export const deleteNode = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.nodes.delete(id);
});

export const updateNodePositions = query('unchecked', async ({ updates }) => {
	const bloko = getBloko();
	for (const { id, sort, _parent } of updates) {
		await bloko.crud.nodes.update(id, { sort, _parent });
	}
});

// Templates
export const createTemplate = query('unchecked', ({ _collection, code, title, notes }) => {
	const bloko = getBloko();
	return bloko.crud.templates.create({ _collection, code, title, notes });
});

export const updateTemplate = query('unchecked', ({ id, code, title, notes }) => {
	const bloko = getBloko();
	return bloko.crud.templates.update(id, { code, title, notes });
});

export const deleteTemplate = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.templates.delete(id);
});

// Blocks
export const createBlock = query('unchecked', ({ _template, _parent, code }) => {
	const bloko = getBloko();
	return bloko.crud.blocks.create({ _template, _parent, code, notes: null });
});

export const updateBlock = query('unchecked', ({ id, code, notes, content_type, title }) => {
	const bloko = getBloko();
	return bloko.crud.blocks.update(id, { code, notes, content_type, title });
});

export const deleteBlock = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.blocks.delete(id);
});

export const reorderBlocks = query('unchecked', async ({ updates }) => {
	const bloko = getBloko();
	for (const { id, sort, _parent } of updates) {
		await bloko.crud.blocks.update(id, { sort, _parent });
	}
});

// Contents - keep using query file for complex upsert logic
export const updateContent = query('unchecked', ({ _node, _block, value, forceCreate }) =>
	contentsQueries.upsertContent({ _node, _block, value, forceCreate })
);

// Relation Types
export const createRelationType = query('unchecked', ({ _collection, code, title, reverse_title, notes }) => {
	const bloko = getBloko();
	return bloko.crud.nodeRelationTypes.create({ _collection, code, title, reverse_title, notes });
});

export const updateRelationType = query('unchecked', ({ id, code, title, reverse_title, notes }) => {
	const bloko = getBloko();
	return bloko.crud.nodeRelationTypes.update(id, { code, title, reverse_title, notes });
});

export const deleteRelationType = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.nodeRelationTypes.delete(id);
});

// Relations
export const createRelation = query('unchecked', ({ _node_relation_type, _from, _to }) => {
	const bloko = getBloko();
	return bloko.crud.nodeRelations.create({ _node_relation_type, _from, _to });
});

export const deleteRelation = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.nodeRelations.delete(id);
});

export const getNodesForRelation = query('unchecked', async ({ collectionId, nodeType, excludeNodeId }) => {
	const bloko = getBloko();
	const nodes = await bloko.crud.nodes.findByCollection(collectionId);
	return nodes.filter(n =>
		(!nodeType || n._node_type === nodeType) &&
		n.id !== excludeNodeId
	);
});

// Image upload - takes base64 data to avoid CSRF issues with FormData
export const uploadImage = query('unchecked', async ({ base64Data, fileName, mimeType, nodeId }) => {
	// Validate file type
	if (!mimeType.startsWith('image/') || mimeType === 'image/svg+xml') {
		throw new Error('Only raster images are supported (JPG, PNG, WebP, GIF). SVG is not supported.');
	}

	// Convert base64 to buffer
	const buffer = Buffer.from(base64Data, 'base64');

	// Upload via bloko
	const bloko = getBloko();
	const result = await bloko.images.upload(buffer, fileName, nodeId);

	return result;
});

// Image delete - deletes from S3 and database
export const deleteImage = query('unchecked', async ({ imageId }) => {
	const bloko = getBloko();
	await bloko.images.delete(imageId);
});
