import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: '../../dist/studio',
			// Increase body size limit to 50MB for image uploads
			bodyLimit: 52428800  // 50 MB in bytes
		}),
		csrf: {
			trustedOrigins: []  // Disable CSRF protection for API endpoints
		},
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			// async: true
		}
	}
};

export default config;
