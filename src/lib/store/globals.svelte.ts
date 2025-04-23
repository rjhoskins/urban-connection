export let globals = $state({
	pageName: '',
	isLoading: false,
	isError: false,
	error: null as Error | null,
	isFetching: false,
	status: 'idle' as 'idle' | 'loading' | 'error' | 'success',
	assessmentParticipantName: '',
	setPageName(name: string) {
		this.pageName = name;
	},
	setLoading(loading: boolean) {
		this.isLoading = loading;
		this.status = loading ? 'loading' : 'idle';
	},
	setError(error: Error | null) {
		this.isError = !!error;
		this.error = error;
		this.status = error ? 'error' : 'idle';
	},
	setSuccess() {
		this.status = 'success';
		this.isError = false;
		this.error = null;
	},
	setFetching(fetching: boolean) {
		this.isFetching = fetching;
	}
});
