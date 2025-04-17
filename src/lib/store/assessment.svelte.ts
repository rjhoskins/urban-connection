export let currAssessment = $state({
	assessmentParticipantName: '',
	currAssessmentId: undefined as number | undefined,
	currAssessmentData: [],
	currAssessmentStatus: '',
	assessmentQuestions: [] as any[],
	setAssessmentParticipantName(name: string) {
		this.assessmentParticipantName = name;
	},
	setAssessmentId(assessmentId: number | undefined) {
		this.currAssessmentId = assessmentId;
	},
	setcurrAssessmentData(currAssessmentData: any) {
		this.currAssessmentData = currAssessmentData;
	},
	setcurrAssessmentStatus(currAssessmentStatus: string) {
		this.currAssessmentStatus = currAssessmentStatus;
	},
	setAssessmentQuestions(assessmentQuestions: any[]) {
		this.assessmentQuestions = assessmentQuestions;
	}
});
