import { getContext, setContext } from 'svelte';

const GLOBALS_CONTEXT_KEY = 'globals';

export class GlobalsState {
	pageName = $state('');
	isLoading = $state(false);
	isError = $state(false);
	error = $state<Error | null>(null);
	isFetching = $state(false);
	status = $state<'idle' | 'loading' | 'error' | 'success'>('idle');
	currAssessmentId = $state<number | undefined>(undefined);
	assessmentParticipantName = $state('');

	setPageName(name: string) {
		this.pageName = name;
	}

	setLoading(loading: boolean) {
		this.isLoading = loading;
		this.status = loading ? 'loading' : 'idle';
	}

	setError(error: Error | null) {
		this.isError = !!error;
		this.error = error;
		this.status = error ? 'error' : 'idle';
	}

	setSuccess() {
		this.status = 'success';
		this.isError = false;
		this.error = null;
	}

	setFetching(fetching: boolean) {
		this.isFetching = fetching;
	}
}
export function setGlobalsContext() {
	setContext(GLOBALS_CONTEXT_KEY, new GlobalsState());
}

export function getGlobalsContext() {
	return getContext<GlobalsState>(GLOBALS_CONTEXT_KEY);
}
