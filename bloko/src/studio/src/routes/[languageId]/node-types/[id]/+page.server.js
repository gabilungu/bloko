import { getBloko } from '$lib/server/bloko.js';

export async function load({ params, depends }) {
	depends('app:node-types');

	const bloko = getBloko();
	const nodeType = await bloko.crud.nodeTypes.findById(params.id);

	return { nodeType };
}
