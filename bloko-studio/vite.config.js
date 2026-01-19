import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: ['bloko', 'sharp', 'pg', '@aws-sdk/client-s3']
	},
	server: {
		port: 3333
	}
});
