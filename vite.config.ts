import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	server: {
		allowedHosts: ['localhost', '872700b78225.ngrok-free.app', '91a712ef7d4d.ngrok-free.app']
	},
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'rjhoskins',
				project: 'urban-connection'
			}
		}),
		sveltekit(),
		devtoolsJson()
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
