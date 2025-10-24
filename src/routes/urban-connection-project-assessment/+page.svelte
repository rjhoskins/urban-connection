<script lang="ts">
	// The teacher/ staff will need to enter their name, select a subject area from a drop-down (English, Math, etc. DC to provide), number of years experience)
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import AssessmentDomainProgressCard from '$lib/components/assessment-domain-progress-card.svelte';
	import DemographicsAndAssessmentForm from '$lib/components/forms/demographics-and-assessment-form.svelte';

	import Card from '$lib/components/ui/card/card.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import YoutubeVidsModal from '$lib/components/youtube-vids-modal.svelte';
	import { ASSESSMENT_PROGRESS_IMG_MAP, videoIdMap } from '$lib/constants';
	import { getModalStateContext } from '$lib/modal-state.svelte';
	import { Video } from 'lucide-svelte';
	const modal = getModalStateContext();
	import { onMount, tick } from 'svelte';
	// http://localhost:5173/urban-connection-project-assessment?assessmentToken=VHpsV1VPYlpwMDhSTWl4NHwyMXwzMzVBQnA=

	let { data } = $props();
	let {
		assessmentToken,
		assessmentQuestions,
		currDemgraphicsData,
		currAssessmentData,
		// svelte-ignore non_reactive_update
		lastAnsweredQuestionIdInDomain: lastAnsweredDomain,
		// svelte-ignore non_reactive_update
		lastAnsweredQuestionIdInSubdomain: lastAnsweredSubdomainId
	} = data;
	let formData = $state(assessmentQuestions);
	let currDomain = $state(1);
	let currSubDomain = $state(0);
	let currOnPageVideoId = $state('');
	let initialDemographicsVideoShown = $state(false);

	const totalQuestions = $derived.by(() => {
		let totalQuestions = 0;
		return totalQuestions;
	});
	// svelte-ignore state_referenced_locally
	const domains = assessmentQuestions
		.filter((domain) => domain?.name?.toLowerCase() !== 'demographics')
		.map((domain) => {
			return {
				name: domain.name,
				imgUrl: ASSESSMENT_PROGRESS_IMG_MAP.get(domain.name) || ''
				// status: 'not-started'
			};
		});

	function setOnPageEmbeddedId(videoId: string) {
		currOnPageVideoId = videoId;
	}

	let isDemographicsQuestions = $derived(
		formData?.[currDomain]?.subDomains?.[currSubDomain]?.name.toLowerCase() == 'demographics'
	);
	let currQuestionsProgress = $derived(
		assessmentQuestions?.[currDomain]?.subDomains?.[currSubDomain]?.questions?.length || 0
	);

	let isLastQuestion = $derived(
		formData.length == currDomain + 1 && formData[currDomain].subDomains.length == currSubDomain + 1
	);

	function applyCurrentProgress() {
		console.log(
			'Applying current progress from form:',
			lastAnsweredDomain,
			lastAnsweredSubdomainId
		);
		if (lastAnsweredDomain && lastAnsweredSubdomainId) {
			const domainIndex = formData.findIndex((domain) => domain.id === lastAnsweredDomain);
			const subDomainIndex = formData[domainIndex].subDomains.findIndex(
				(subDomain: { id: number }) => subDomain.id === lastAnsweredSubdomainId
			);
			console.log(
				'Applied progress:',
				domainIndex,
				subDomainIndex,
				lastAnsweredDomain,
				lastAnsweredSubdomainId
			);
			(function setToNextSubdomainOrDomain() {
				if (subDomainIndex + 1 < formData[domainIndex]?.subDomains.length) {
					return subDomainIndex + 1;
				} else if (domainIndex + 1 < formData.length) {
					currDomain = domainIndex + 1;
					return 0; // set to next domain's first subdomain
				} else {
					// at the end already
					return subDomainIndex; // stay at current
				}
			})();
		}
	}

	function handleOnPageVideoIdChange({
		currDomain,
		currSubDomain
	}: {
		currDomain: number;
		currSubDomain: number;
	}) {
		// console.log('currDomain or currSubDomain changed:', currDomain, currSubDomain);
		switch (currDomain) {
			// 1-based indexing bc mixing it is fun
			// actually jk - case 0 is demographics
			case 1:
				if (currSubDomain !== 0) return;
				setOnPageEmbeddedId(videoIdMap.get('onPage-domain-societalAwareness') ?? '');
				break;
			case 2:
				if (currSubDomain !== 0) return;
				setOnPageEmbeddedId(videoIdMap.get('onPage-domain-systems') ?? '');
				break;
			case 3:
				if (currSubDomain !== 0) return;
				setOnPageEmbeddedId(videoIdMap.get('onPage-domain-buildingRelationships') ?? '');
				break;
			case 4:
				if (currSubDomain !== 0) return;
				setOnPageEmbeddedId(videoIdMap.get('onPage-domain-rigorousAndAccessibleContent') ?? '');
				break;
			default:
				break;
		}
	}
	function handleModalVideoIdChange({
		currDomain,
		currSubDomain
	}: {
		currDomain: number;
		currSubDomain: number;
	}) {
		// console.log('modal videoId changed:', currDomain, currSubDomain);

		switch (currDomain) {
			case 0:
				if (currSubDomain !== 0) return;
				modal.setModalEmbeddedId(videoIdMap.get('modal-demographics') ?? '');
				modal.open();
				modal.hideButton = true;
				break;
			case 1:
				if (currSubDomain == 0 && modal.highestSubDomain! <= 0) {
					modal.setModalEmbeddedId(videoIdMap.get('modal-instructions-preload') ?? '');
					modal.open();
				}
				if (currSubDomain == 1 && modal.highestSubDomain <= 1) {
					modal.setModalEmbeddedId(videoIdMap.get('modal-domain-mentorship') ?? '');
					modal.open();
				}
				if (currSubDomain == 2 && modal.highestSubDomain! <= 2) {
					modal.setModalEmbeddedId(videoIdMap.get('modal-domain-representation') ?? '');
					modal.open();
				}
				if (currSubDomain == 3 && modal.highestSubDomain! < 3) {
					modal.setModalEmbeddedId(videoIdMap.get('modal-domain-summaryInstructions') ?? '');
					modal.open();
				}
				break;

			default:
				break;
		}
	}

	function next() {
		if (
			formData.length == currDomain + 1 &&
			formData[currDomain].subDomains.length == currSubDomain + 1
		) {
			return;
		}

		if (formData[currDomain].subDomains.length === currSubDomain + 1) {
			if (formData.length === currDomain + 1) {
				return;
			}
			currDomain += 1;
			currSubDomain = 0;
		} else {
			currSubDomain += 1;
		}
	}

	function previous() {
		if (currSubDomain === 0) {
			if (currDomain === 0) {
				return;
			}
			currDomain -= 1;
			currSubDomain = formData[currDomain].subDomains.length - 1;
		} else {
			currSubDomain -= 1;
		}
	}

	function openInstructionsModal() {
		modal.setModalEmbeddedId(videoIdMap.get('modal-instructions-btn') ?? '');
		modal.open();
	}

	onMount(() => {
		if (currDomain === 0 && currSubDomain === 0) {
			console.log('Showing initial demographics video');
		}
		// console.log('page mounted');
		// // console.log('domains ====> ', domains);
		// applyCurrentProgress();
		// console.log('All reactive state:', {
		// 	domains
		// });
		// console.log('All reactive state:', {
		// 	formData: $state.snapshot(formData)
		// 	// currDomain: $state.snapshot(currDomain),
		// 	// currSubDomain: $state.snapshot(currSubDomain),
		// 	// currOnPageVideoId: $state.snapshot(currOnPageVideoId),
		// 	// currModalVideoId: $state.snapshot(currModalVideoId),
		// 	// isDemographicsQuestions: $state.snapshot(isDemographicsQuestions),
		// 	// currQuestionsProgress: $state.snapshot(currQuestionsProgress),
		// 	// isLastQuestion: $state.snapshot(isLastQuestion),
		// 	// totalQuestions: $state.snapshot(totalQuestions)
		// });
	});
	$effect(() => {
		handleOnPageVideoIdChange({ currDomain, currSubDomain });
		handleModalVideoIdChange({ currDomain, currSubDomain });
		modal.handleHighestPositionUpdates({ currDomain, currSubDomain });
		if (currDomain === 1 && currSubDomain === 0) modal.hideButton = false;

		console.log('assessments', assessmentQuestions);
		// console.log('modal videoId changed:', { currDomain, currSubDomain, currModalVideoId });
	});
</script>

<section class="mx-auto max-w-7xl space-y-5 p-2 lg:p-8">
	<h1 class="text-3xl">Culturally Responsive teaching Progress Monitoring Assessment</h1>
	{#if isDemographicsQuestions}
		<Card class="p-4 shadow-md">
			{formData[currDomain].subDomains[currSubDomain].description}
		</Card>
	{:else}
		<!-- TODO: PHASE 2 -->
		<!-- <Card class="p-4 shadow-md">
			<div class="flex grow flex-col gap-2 text-sm font-normal">
				<div class="flex grow flex-col gap-2">
					<div class="flex justify-between">
						<p>Assessment Progress</p>
						<p>{Math.round(0.5 * 100)}%</p>
					</div>
				</div>
				<Progress barBgColor="bg-primary" class="h-[9px]" value={0.5 * 100} />
			</div>
		</Card> -->
		<!-- TODO: PHASE 2 -->
		<div class="grid grid-cols-4 gap-4 py-4">
			{#each domains as domain, index (index)}
				<!-- +1 bc demographics not included -->
				<AssessmentDomainProgressCard
					posIndex={index + 1}
					{currDomain}
					name={domain.name}
					imgUrl={domain.imgUrl}
				/>
			{/each}
		</div>

		<div class=" grid grid-cols-2 gap-6">
			<div class="left col-span-1 flex flex-col gap-4 space-y-3">
				{#if currSubDomain === 0}
					<div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-3xl">
						{@html `<iframe class="h-[315px] w-full" src="https://www.youtube.com/embed/${currOnPageVideoId}?rel=0&autoplay=&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
					</div>
				{/if}
				{#if formData?.[currDomain]?.subDomains?.[currSubDomain]?.name}
					<div class="flex items-center gap-4">
						<p class="text-2xl font-bold">
							{formData[currDomain].subDomains[currSubDomain].name}
						</p>
						<p class="text-primary rounded-full bg-[#F9F5D8] p-2 py-1 text-sm font-normal">
							{formData[currDomain].subDomains[currSubDomain].questions?.length} descriptors
						</p>
					</div>
					{#if currDomain === 1 && currSubDomain === 0}
						<div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-3xl">
							{@html `<iframe class="h-[315px] w-full" src="https://www.youtube.com/embed/${videoIdMap.get('onPage-subDomain-awarenessIntro')}?rel=0&autoplay=0&controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
						</div>
					{/if}
				{/if}
				<div class="rounded-md bg-[#EFF2FE]/50 p-4">
					<p class=" mb-4 text-lg font-bold">Read the indicator summary below.</p>
					<div class="text-basetext-[#334155]">
						{#if formData?.[currDomain]?.subDomains?.[currSubDomain] && formData?.[currDomain]?.subDomains?.[currSubDomain]?.description}
							<p class="">{formData?.[currDomain]?.subDomains?.[currSubDomain]?.description!}</p>
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
							onclick={openInstructionsModal}
							class={`${modal.hideButton ? 'hidden' : 'inline-flex'}  bg-primary text-primary-foreground hover:bg-primary/90 text   h-10 w-fit items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0`}
						>
							<Video class="mr-2 h-16 w-16" />
							<p>Instructions</p>
						</button>
					</div>
					<p>
						Now, considering the information you read in the indicator summary, determine if each of
						the descriptors below are represented at your school.
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
				<DemographicsAndAssessmentForm
					bind:demoAndAssessmentformData={formData}
					{currDomain}
					{currSubDomain}
					{assessmentToken}
					handleNext={next}
					handlePrev={previous}
					{isDemographicsQuestions}
					{isLastQuestion}
					formUpdatedAssessmentProgress={() => applyCurrentProgress()}
					bind:formLastAnsweredQuestionIdInDomain={lastAnsweredDomain}
					bind:formLastAnsweredQuestionIdInSubdomain={lastAnsweredSubdomainId}
				/>
			</div>
		</div>
	{/if}
	{#if isDemographicsQuestions}
		<DemographicsAndAssessmentForm
			bind:demoAndAssessmentformData={formData}
			{currDomain}
			{currSubDomain}
			{assessmentToken}
			handleNext={next}
			handlePrev={previous}
			{isDemographicsQuestions}
			{isLastQuestion}
			formUpdatedAssessmentProgress={() => applyCurrentProgress()}
			bind:formLastAnsweredQuestionIdInDomain={lastAnsweredDomain}
			bind:formLastAnsweredQuestionIdInSubdomain={lastAnsweredSubdomainId}
		/>
	{/if}

	<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
	<!-- controlled with state -->
	<YoutubeVidsModal />
</section>
