import { getContext, setContext, tick } from 'svelte';
import { videoIdMap } from './constants';

enum ModalMode {
	AUTO,
	MANUAL,
	CLOSED
}

interface ModalsState {
	// props
	mode: ModalMode;
	manualSetVideoId: string;
	currDomain: number;
	currSubDomain: number;
	isResumeAssessmentOpen: boolean;
	isResumeAssessmentResume: boolean;
	ytModalIsOpen: boolean;
	ytIsManualVid: boolean;
	maxSeenDomain: number;
	maxSeenSubDomain: number;
	currYTModalVideoId: string | undefined;
	assessmentParticipantEmail?: string;

	// methods
	handlePositionChange: () => void;
	handleModalVideoClose: () => void;
	handleManualVideoSelect: (videoId: string) => void;
	setDomainAndSubDomain: (params: { domainIdx: number; subDomainIdx: number }) => void;
	clearManualSetVideoId: () => void;
	fhandleOutSideClick: (event: MouseEvent) => void;
	setModalEmbeddedId: (videoId: string) => void;
	returnToAutoVideoSelect: () => void;
	setMaxSeens: () => void;
	toggle: () => void;
}

export class ModalsStateClass implements ModalsState {
	// properties
	mode = $state(ModalMode.AUTO);
	#currDomain = $state(-1); // initialize to -1 to indicate no domain selected (before assessment starts)
	#currSubDomain = $state(0);
	#maxSeenDomain = $state(0);
	#maxSeenSubDomain = $state(0);
	isResumeAssessmentOpen = $state(false);
	isResumeAssessmentResume = $state(false);
	ytModalIsOpen = $state(false);
	ytIsManualVid = $state(false);
	manualSetVideoId = $state('');
	assessmentParticipantEmail = $state<string | undefined>(undefined);

	constructor(context?: Partial<ModalsState>) {}

	setMaxSeens() {
		this.#maxSeenDomain = Math.max(this.#maxSeenDomain, this.#currDomain);
		this.#maxSeenSubDomain = Math.max(this.#maxSeenSubDomain, this.#currSubDomain);
	}

	get maxSeenDomain() {
		return this.#maxSeenDomain;
	}

	get maxSeenSubDomain() {
		return this.#maxSeenSubDomain;
	}
	get currDomain() {
		return this.#currDomain;
	}
	get currSubDomain() {
		return this.#currSubDomain;
	}

	currYTModalVideoId = $derived.by(() => {
		switch (this.#currDomain) {
			case 0: // Cultural awareness
				if (this.#currSubDomain === 0 && this.#maxSeenSubDomain === 0) {
					return videoIdMap.get('modal-instructions-preload');
				}
				if (this.#currSubDomain == 1 && this.#maxSeenSubDomain <= 1) {
					return videoIdMap.get('modal-domain-mentorship');
				}
				if (this.#currSubDomain == 2 && this.#maxSeenSubDomain <= 2) {
					return videoIdMap.get('modal-domain-representation');
				}
				if (this.#currSubDomain == 3 && this.#maxSeenSubDomain <= 3) {
					return videoIdMap.get('modal-domain-summaryInstructions');
				} else {
					return '';
				}
				break;
			default:
				return '';
		}
	});

	setDomainAndSubDomain({ domainIdx, subDomainIdx }: { domainIdx: number; subDomainIdx: number }) {
		this.#currDomain = domainIdx;
		this.#currSubDomain = subDomainIdx;
	}

	handleManualVideoSelect(videoId: string) {
		this.manualSetVideoId = videoId;
		this.ytIsManualVid = true;
		this.ytModalIsOpen = true;
	}

	handleModalVideoClose() {
		this.ytModalIsOpen = false;
		this.manualSetVideoId = '';
		this.ytIsManualVid = false; // reset to auto mode
	}

	handlePositionChange() {
		this.setMaxSeens();
		if (this.currYTModalVideoId != '') {
			this.ytModalIsOpen = true;
		} else {
			this.ytModalIsOpen = false;
		}
		this.setMaxSeens();
	}

	clearManualSetVideoId() {
		this.manualSetVideoId = '';
		this.ytIsManualVid = false;
	}

	fhandleOutSideClick(event: MouseEvent) {
		if (event.target == event.currentTarget) {
			this.ytModalIsOpen = false;
			this.manualSetVideoId = '';
		}
	}

	setModalEmbeddedId(videoId: string) {
		this.manualSetVideoId = videoId;
		this.ytModalIsOpen = true;
	}

	returnToAutoVideoSelect() {
		this.manualSetVideoId = '';
	}

	toggle() {
		this.ytModalIsOpen = !this.ytModalIsOpen;
	}
}

const MODAL_STATE_CTX = Symbol('modal-state-context');

export function setModalStateContext(context?: Partial<ModalsState>) {
	const modalState = new ModalsStateClass(context);
	setContext(MODAL_STATE_CTX, modalState);
	return modalState;
}

export function getModalStateContext() {
	return getContext<ModalsStateClass>(MODAL_STATE_CTX);
}
