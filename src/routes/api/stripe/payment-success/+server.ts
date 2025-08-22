import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateSchoolStripeData } from '$lib/server/queries';

interface StripeData {
	stripePaymentId: string;
	userId: string;
	schoolId: number;
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
			stripeData = {
				stripePaymentId: data.object.id,
				userId: data.metadata.userId,
				schoolId: data.metadata.schoolId,
				payment_date: new Date(data.object.created * 1000).toISOString()
			};
			const result = await updateSchoolStripeData({
				id: stripeData.schoolId,
				stripePaymentId: stripeData.stripePaymentId,
				stripeData: JSON.stringify(stripeData)
			});

			console.log('DID something with Stripe data........:', result, stripeData);
		} catch (error) {
			console.error('Error storing stripe data', error);
		}
	}

	return json({ success: true, message: 'Stripe payment successful', data });
};
