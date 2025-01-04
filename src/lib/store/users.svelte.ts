export let users = $state({
	users: ['UC', 'District', 'School_Admin'],
	selectedUser: '',
	addUser(user: string) {
		this.users.push(user);
	},
	setSelectedUser(index: number) {
		this.selectedUser = this.users[index];
	}
});
