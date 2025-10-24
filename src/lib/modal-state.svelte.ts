import { getContext, setContext, tick } from 'svelte';

interface ModalsState {
	// props
	isOpen: boolean;
	buttonTitle: string;

	isInitialModal: boolean;
	isMuted: number;
	videoId: string;
	initialVideoShown: boolean;

	// methods
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export class ModalsStateClass implements ModalsState {
	// properties
	isOpen = $state(true);
	buttonTitle = $state('');
	isInitialModal = false;
	isMuted = $state(0);
	highestDomain = $state(0);
	highestSubDomain = $state(0);

	videoId = $state('');
	hideButton = $state(false);
	initialVideoShown = false;

	setVideoId(id: string) {
		this.videoId = id;
	}

	fhandleOutSideClick(event: MouseEvent) {
		if (event.target == event.currentTarget) {
			this.isOpen = false;
			this.setVideoId('');
			this.close();
		}
	}

	handleHighestPositionUpdates({
		currDomain,
		currSubDomain
	}: {
		currDomain: number;
		currSubDomain: number;
	}) {
		this.highestDomain = Math.max(this.highestDomain, currDomain);
		this.highestSubDomain = Math.max(this.highestSubDomain, currSubDomain);
	}

	setModalEmbeddedId(videoId: string) {
		this.videoId = videoId;
		this.open();
	}

	clearVideoIds() {
		this.videoId = '';
	}

	handleStaticModalOpen(id: string) {
		this.setVideoId(this.videoId as string);
		setTimeout(() => {
			this.open();
		}, 100);
	}

	async handleDynamicModalOpen() {
		this.setVideoId(this.videoId);
		setTimeout(async () => {
			await tick();
			this.open();
		}, 100);
	}

	open() {
		this.isOpen = true;
	}
	close() {
		this.isOpen = false;
		setTimeout(() => {
			this.hideButton = false;
		}, 500);
	}
	toggle() {
		this.isOpen = !this.isOpen;
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
