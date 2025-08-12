import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	server: {
		allowedHosts: ['localhost', '872700b78225.ngrok-free.app']
	},
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'rjhoskins',
				project: 'urban-connection'
			}
		}),
		sveltekit()
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
