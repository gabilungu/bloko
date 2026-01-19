import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:node-types');

	const bloko = getBloko();
	const nodeTypes = await bloko.crud.nodeTypes.findAll();

	return { nodeTypes };
}
