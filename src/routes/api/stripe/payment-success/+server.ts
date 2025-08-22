import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface StripeData {
	stripe_payment_id: string;
	userId: string;
	schoolId: number;
	payment_date: string;
}

export const POST: RequestHandler = async (event) => {
	const { request } = event;
	const body = await request.json();
	let stripeData: StripeData | {} = {};

	const { data } = body;
	console.log('Doing something with Stripe data........:', data);
	// if (data.object.status === 'complete') {
	// 	stripeData = {
	// 		stripe_payment_id: data.object.id,
	// 		userId: data.metadata.userId,
	// 		schoolId: data.metadata.schoolId,
	// 		payment_date: new Date(data.object.created * 1000).toISOString()
	// 	};

	// 	try {
	// 		// do something with stripeData...
	// 		console.log('Doing something with Stripe data........:', stripeData);
	// 	} catch (error) {
	// 		console.error('Error storing stripe data', error);
	// 	}
	// }

	return json({ success: true, message: 'Stripe payment successful', data });
};
