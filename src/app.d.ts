// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Platform {}
		namespace Superforms {
			type Message = { status: 'error' | 'success' | 'warning'; text: string };
		}
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}

export {};
