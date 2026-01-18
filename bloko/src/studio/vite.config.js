import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'$driver': resolve(__dirname, '../../dist/driver')
		}
	},
	ssr: {
		external: ['sharp', 'pg', '@aws-sdk/client-s3']
	},
	server: {
		fs: {
			allow: ['.', '../../dist/driver']
		}
	}
});
