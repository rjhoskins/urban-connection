import adapter from '@sveltejs/adapter-vercel';

const isDev = process.env.NODE_ENV === 'development';

export default {
	kit: {
		csrf: {
			checkOrigin: isDev ? false : true // Disable CSRF check for local development
		},
		adapter: adapter({
			// see below for options that can be set here
		})
	}
};
