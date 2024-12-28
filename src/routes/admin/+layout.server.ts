import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	// console.log('layout data =====================');
	const res = await fetch('http://localhost:5173/data/data.json');
	const resData = await res.json();
	// console.log(resData);
	return {
		fetchedData: resData
	};
}) satisfies LayoutServerLoad;
