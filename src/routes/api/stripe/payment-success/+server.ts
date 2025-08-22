import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateSchoolStripeData } from '$lib/server/queries';

interface StripeData {
	stripePaymentId: string;
	schoolId: string;
	userId: string;
	payment_date: string;
}

export const POST: RequestHandler = async (event) => {
	const { request } = event;
	const body = await request.json();
	let stripeData: StripeData;

	const { data } = body;
	console.log('Doing something with Stripe data........:', data);
	if (data.object.status === 'complete') {
		try {
			// do something with stripeData...
			const result = await updateSchoolStripeData({
				id: parseInt(data.metadata.schoolId, 10),
				stripePaymentId: data.object.id,
				stripeData: JSON.stringify({
					stripePaymentId: data.object.id,
					schoolId: data.metadata.schoolId,
					userId: data.metadata.userId,
					payment_date: new Date(data.object.created * 1000).toISOString()
				})
			});

			console.log('DID something with Stripe data........:', result);
		} catch (error) {
			console.error('Error storing stripe data', error);
		}
	}

	return json({ success: true, message: 'Stripe payment successful', data });
};
