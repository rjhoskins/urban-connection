export let globals = $state({
	pageName: '',
	assessmentParticipantName: '',
	setPageName(name: string) {
		this.pageName = name;
	}
});
