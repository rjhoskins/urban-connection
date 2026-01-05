<script lang="ts">
	import { page } from '$app/state';
	import AssessmentDomainProgressCard from '$lib/components/assessment-domain-progress-card.svelte';
	import AssessmentQuestionsForm from '$lib/components/forms/assessment-questions-form.svelte';

	import Card from '$lib/components/ui/card/card.svelte';
	import { ASSESSMENT_PROGRESS_IMG_MAP, videoIdMap } from '$lib/constants';
	import { getModalStateContext } from '$lib/modal-state.svelte';
	import { logIfDev } from '$lib/utils.js';
	import { is, type max } from 'drizzle-orm';

	import { Video } from 'lucide-svelte';
	const modal = getModalStateContext();
	import { onMount, tick } from 'svelte';

	// http://localhost:5173/urban-connection-project-assessment?assessmentId=MrdTxI9byd

	let { data } = $props();
	let {
		assessmentQuestions,
		// svelte-ignore non_reactive_update
		assessmentId,
		answeredAssessmentQuestionsData,
		// svelte-ignore non_reactive_update
		lastAnsweredQuestionIdInDomain: lastAnsweredDomainId,
		// svelte-ignore non_reactive_update
		lastAnsweredQuestionIdInSubdomain: lastAnsweredSubdomainId
	} = data;
	let isLoading = $state(true);
	let formData = $state(answeredAssessmentQuestionsData);

	const totalQuestions = $derived.by(() => {
		let totalQuestions = 0;
		return totalQuestions;
	});
	// svelte-ignore state_referenced_locally
	const domains = assessmentQuestions.map((domain) => {
		return {
			name: domain.name,
			imgUrl: ASSESSMENT_PROGRESS_IMG_MAP.get(domain.name) || ''
			// status: 'not-started'
		};
	});

	let currQuestionsProgress = $derived(
		assessmentQuestions?.[modal.currDomain]?.subDomains?.[modal.currSubDomain]?.questions?.length ||
			0
	);

	let isLastQuestion = $derived.by(() => {
		const lastDomainIdx = formData.length - 1;
		if (modal.currDomain < lastDomainIdx) return false;
		const lastSubDomainIdx = formData[modal.currDomain]?.subDomains.length - 1;
		if (modal.currSubDomain < lastSubDomainIdx) return false;
		return true;
	});

	let currOnPageVideoId = $derived.by(() => {
		switch (modal.currDomain) {
			case 0:
				if (modal.currSubDomain === 0) return videoIdMap.get('onPage-subDomain-awarenessIntro');
				return '';
			case 1:
				if (modal.currSubDomain !== 0) return '';
				return videoIdMap.get('onPage-domain-societalAwareness');
			case 2:
				if (modal.currSubDomain !== 0) return '';
				return videoIdMap.get('onPage-domain-systems');
			case 3:
				if (modal.currSubDomain !== 0) return '';
				return videoIdMap.get('onPage-domain-buildingRelationships');
			case 4:
				if (modal.currSubDomain !== 0) return '';
				return videoIdMap.get('onPage-domain-rigorousAndAccessibleContent');
			default:
				return '';
		}
	});

	async function applyCurrentProgress() {
		//start
		if (!lastAnsweredDomainId && !lastAnsweredSubdomainId) {
			console.log('start & setting indices....');
			modal.setDomainAndSubDomain({
				domainIdx: 0,
				subDomainIdx: 0
			});
			console.log('set indices & state');
		} else {
			//resume
			const currDomainIndex = formData.findIndex((domain) => domain.id === lastAnsweredDomainId);
			const currSubDomainIndex = formData[currDomainIndex]?.subDomains.findIndex(
				(subDomain: { id: number }) => subDomain.id === lastAnsweredSubdomainId
			);
			console.log('resume indices:', {
				lastAnsweredDomainId,
				lastAnsweredSubdomainId,
				currDomainIndex,
				currSubDomainIndex
			});
			(function setToHighestSeenDomainAndSubdomain() {
				if (
					isDomainAtLastIndex(currDomainIndex) &&
					isSubdomainAtLastIndex({
						domainIdx: currDomainIndex,
						subDomainIdx: currSubDomainIndex
					})
				) {
					//at end of assessment
					console.log('At last index of domain and subdomain, putting to max seen');

					modal.setDomainAndSubDomain({
						domainIdx: currDomainIndex,
						subDomainIdx: currSubDomainIndex
					});
				} else if (
					isSubdomainAtLastIndex({
						domainIdx: currDomainIndex,
						subDomainIdx: currSubDomainIndex
					})
				) {
					console.log(
						`At ${modal.currDomain}|${modal.currSubDomain} last subdomain:${modal.currSubDomain} => next domain`
					);

					modal.setDomainAndSubDomain({
						domainIdx: currDomainIndex + 1,
						subDomainIdx: 0
					});
				} else {
					console.log(`At ${modal.currDomain}|${modal.currSubDomain}, next subdomain`);
					modal.setDomainAndSubDomain({
						domainIdx: currDomainIndex,
						subDomainIdx: currSubDomainIndex + 1
					});
				}
			})();
		}

		isLoading = false;
		modal.handlePositionChange();
	}

	function isDomainAtLastIndex(domainIdx: number): boolean {
		// console.log('isDomainAtLastIndex:', {
		// 	domainIdx,
		// 	formDataLength: formData.length,
		// 	isLast: domainIdx == formData.length - 1
		// });
		const lastDomainIdx = formData.length - 1;
		return domainIdx == lastDomainIdx;
	}

	function isSubdomainAtLastIndex({
		domainIdx,
		subDomainIdx
	}: {
		domainIdx: number;
		subDomainIdx: number;
	}): boolean {
		const currDomainSubDomainLastIdx = formData[domainIdx]?.subDomains.length - 1;
		const isLast = subDomainIdx == currDomainSubDomainLastIdx;
		console.log('isSubdomainAtLastIndex:', {
			domainIdx,
			sudz: subDomainIdx,
			currDomainSubDomainLastIdx,
			currSubDomainsLength: formData[domainIdx]?.subDomains.length,
			isLast
		});
		return isLast;
	}

	function next() {
		if (
			//at end of assessment should already be here from applyCurrentProgress
			isDomainAtLastIndex(modal.currDomain) &&
			isSubdomainAtLastIndex({
				domainIdx: modal.currDomain,
				subDomainIdx: modal.currSubDomain
			})
		) {
		} else if (
			isSubdomainAtLastIndex({
				domainIdx: modal.currDomain,
				subDomainIdx: modal.currSubDomain
			})
		) {
			//end of domain
			modal.setDomainAndSubDomain({
				domainIdx: modal.currDomain + 1,
				subDomainIdx: 0
			});
		} else {
			//middle of domain
			modal.setDomainAndSubDomain({
				domainIdx: modal.currDomain,
				subDomainIdx: modal.currSubDomain + 1
			});
		}

		modal.handlePositionChange();
	}

	function previous() {
		console.log('prev indices:', {
			currDomain: modal.currDomain,
			currSubDomain: modal.currSubDomain
		});
		if (modal.currDomain === 0 && modal.currSubDomain === 0) {
			// start of assessment
			return;
		} else if (modal.currSubDomain === 0) {
			// start of prior domain
			modal.setDomainAndSubDomain({
				domainIdx: modal.currDomain - 1,
				subDomainIdx: formData[modal.currDomain - 1].subDomains.length - 1
			});
		} else {
			// middle of prior
			modal.setDomainAndSubDomain({
				domainIdx: modal.currDomain,
				subDomainIdx: modal.currSubDomain - 1
			});
		}
		modal.handlePositionChange();
	}

	function openInstructionsModal() {
		modal.handleManualVideoSelect('modal-instructions-btn');
	}

	onMount(async () => {
		await applyCurrentProgress();
		// console.log('Mounted assessment page with data:', data);
		console.log('============MOUNTED==============', {
			answeredAssessmentQuestionsData,
			assessmentQuestions
		});

		console.log('REACTIVE STATE:', {
			// formData: $state.snapshot(formData),
			currDomain: $state.snapshot(modal.currDomain),
			currSubDomain: $state.snapshot(modal.currSubDomain),
			currYTModalVideoId: $state.snapshot(modal.currYTModalVideoId),
			ytModalIsOpen: $state.snapshot(modal.ytModalIsOpen),
			ytIsManualVid: $state.snapshot(modal.ytIsManualVid),
			currOnPageVideoId: currOnPageVideoId,
			maxSeenDomain: $state.snapshot(modal.maxSeenDomain),
			maxSeenSubDomain: $state.snapshot(modal.maxSeenSubDomain)
			// currQuestionsProgress: $state.snapshot(currQuestionsProgress),
			// isLastQuestion: $state.snapshot(isLastQuestion),
			// totalQuestions: $state.snapshot(totalQuestions)
		});
	});

	$effect(() => {
		logIfDev(' REACTIVE STATE CHANGE:', {
			// formData: $state.snapshot(formData),
			currDomain: $state.snapshot(modal.currDomain),
			currSubDomain: $state.snapshot(modal.currSubDomain),
			maxSeenDomain: $state.snapshot(modal.maxSeenDomain),
			maxSeenSubDomain: $state.snapshot(modal.maxSeenSubDomain)

			// currModalVideoId: $state.snapshot(modal.currModalVideoId),
			// currQuestionsProgress: $state.snapshot(currQuestionsProgress),
			// isLastQuestion: $state.snapshot(isLastQuestion),
			// totalQuestions: $state.snapshot(totalQuestions)
		});
	});
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<section class="">
	{#if isLoading}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				class="border-primary h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="mx-auto max-w-7xl space-y-5 p-2 lg:p-8">
			<div class="grid grid-cols-4 gap-4 py-4">
				{#each domains as domain, index (index)}
					<AssessmentDomainProgressCard
						posIndex={index}
						currDomain={modal.currDomain}
						name={domain.name}
						imgUrl={domain.imgUrl}
					/>
				{/each}
			</div>
			<div class=" grid grid-cols-2 gap-6">
				<div class="left col-span-1 flex flex-col gap-4 space-y-3">
					{#if modal.currSubDomain === 0 && currOnPageVideoId}
						<div class="aspect-w-16 aspect-h-9 1st overflow-hidden rounded-3xl">
							{@html `<iframe class="h-[315px] w-full" src="https://www.youtube.com/embed/${currOnPageVideoId}?rel=0&autoplay=&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
						</div>
					{/if}
					{#if formData?.[modal.currDomain]?.subDomains?.[modal.currSubDomain]?.name}
						<div class="flex items-center gap-4">
							<p class="text-2xl font-bold">
								{formData[modal.currDomain].subDomains[modal.currSubDomain].name}
							</p>
							<p class="text-primary rounded-full bg-[#F9F5D8] p-2 py-1 text-sm font-normal">
								{formData[modal.currDomain].subDomains[modal.currSubDomain].questions?.length} descriptors
							</p>
						</div>
						{#if modal.currDomain === 0 && modal.currSubDomain === 0}
							<div class="aspect-w-16 aspect-h-9 2nd overflow-hidden rounded-3xl">
								{@html `<iframe class="h-[315px] w-full" src="https://www.youtube.com/embed/${videoIdMap.get('onPage-domain-societalAwareness')}?rel=0&autoplay=0&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
							</div>
						{/if}
					{/if}
					<div class="rounded-md bg-[#EFF2FE]/50 p-4">
						<p class=" mb-4 text-xl font-bold">Read the indicator summary below.</p>
						<div class="text-basetext-[#334155]">
							{#if formData?.[modal.currDomain]?.subDomains?.[modal.currSubDomain] && formData?.[modal.currDomain]?.subDomains?.[modal.currSubDomain]?.description}
								<p class="text-lg">
									{formData?.[modal.currDomain]?.subDomains?.[modal.currSubDomain]?.description!}
								</p>
							{/if}
						</div>
					</div>
				</div>
				<div class="">
					<div class="prose space-y-3 p-4">
						<div class="mb-4 flex items-center gap-4">
							<p class="text-lg font-bold">Instructions</p>
							<button
								type="button"
								onclick={() => openInstructionsModal()}
								class={` bg-primary  text-primary-foreground hover:bg-primary/90 text inline-flex   h-10 w-fit items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0`}
							>
								<Video class="mr-2 h-16 w-16" />
								<p>Instructions</p>
							</button>
						</div>
						<p>
							Now, considering the information you read in the indicator summary, determine if each
							of the descriptors below are represented at your school.
						</p>
						<p>
							<span class="font-bold">Note: </span> Descriptor scoring is not a measurement of perfection.
						</p>
						<p>
							If a descriptor is an expectation regularly expressed and supported by administration,
							select <span class="font-bold">Yes.</span> Otherwise, select
							<span class="font-bold">No</span>.
						</p>
						<p>Select <span class="font-bold">Next</span> after answering each descriptor.</p>
					</div>
					<AssessmentQuestionsForm
						bind:assessmentformData={formData}
						currDomain={modal.currDomain}
						currSubDomain={modal.currSubDomain}
						{assessmentId}
						handleNext={next}
						handlePrev={previous}
						isFirstQuestion={modal.currDomain === 0 && modal.currSubDomain === 0}
						{isLastQuestion}
						formUpdatedAssessmentProgress={() => applyCurrentProgress()}
						bind:formLastAnsweredQuestionIdInDomain={lastAnsweredDomainId}
						bind:formLastAnsweredQuestionIdInSubdomain={lastAnsweredSubdomainId}
					/>
				</div>
			</div>
		</div>
	{/if}
</section>
