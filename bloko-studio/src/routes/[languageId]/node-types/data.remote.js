import { query } from '$app/server';
import { getBloko } from '$lib/server/bloko.js';

export const getNodeTypes = query('unchecked', () => {
	const bloko = getBloko();
	return bloko.crud.nodeTypes.findAll();
});

export const createNodeType = query('unchecked', ({ code, title, sort, notes }) => {
	const bloko = getBloko();
	return bloko.crud.nodeTypes.create({ code, title, sort, notes });
});

export const updateNodeType = query('unchecked', ({ id, updates }) => {
	const bloko = getBloko();
	return bloko.crud.nodeTypes.update(id, updates);
});

export const deleteNodeType = query('unchecked', ({ id }) => {
	const bloko = getBloko();
	return bloko.crud.nodeTypes.delete(id);
});
