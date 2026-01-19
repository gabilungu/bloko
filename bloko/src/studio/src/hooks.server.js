/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Disable CSRF protection for API routes and image uploads
	if (event.url.pathname.startsWith('/api/') || event.url.pathname.startsWith('/images/')) {
		return await resolve(event, {
			filterSerializedResponseHeaders: (name) => name === 'content-type'
		});
	}

	return await resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
	console.error('[Studio Error]', event.url.pathname, error);
	return {
		message: error instanceof Error ? error.message : 'Internal Error'
	};
}