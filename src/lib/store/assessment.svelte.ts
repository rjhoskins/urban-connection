import { getContext, setContext } from 'svelte';

class AssessmentStateClass implements AssessmentState {
	assessmentParticipantName = $state('');
	currAssessmentId = $state<number | undefined>(undefined);
	currAssessmentData = $state<any[]>([]);
	currAssessmentStatus = $state('');
	assessmentQuestions = $state<any[]>([]);

	setAssessmentParticipantName(name: string) {
		this.assessmentParticipantName = name;
	}

	setAssessmentId(assessmentId: number | undefined) {
		this.currAssessmentId = assessmentId;
	}

	setcurrAssessmentData(currAssessmentData: any) {
		this.currAssessmentData = currAssessmentData;
	}

	setcurrAssessmentStatus(currAssessmentStatus: string) {
		this.currAssessmentStatus = currAssessmentStatus;
	}

	setAssessmentQuestions(assessmentQuestions: any[]) {
		this.assessmentQuestions = assessmentQuestions;
	}
}

const ASSESSMENT_STATE_CTX = Symbol('assessment-state-context');

export function setAssessmentStateContext(context?: Partial<AssessmentState>) {
	const assessmentState = new AssessmentStateClass();
	setContext(ASSESSMENT_STATE_CTX, assessmentState);
	return assessmentState;
}

export function getAssessmentStateContext() {
	return getContext<AssessmentStateClass>(ASSESSMENT_STATE_CTX);
}
