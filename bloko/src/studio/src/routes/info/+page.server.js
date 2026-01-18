import { getBloko } from '$lib/server/bloko.js';

export async function load() {
	const bloko = getBloko();
	const connectionInfo = bloko.connectionInfo();
	return { connectionInfo };
}
