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

	const { data } = body;
	console.log(
		'Doing something with Stripe data........:',
		data.object.status,
		data.object.metadata.schoolId
	);
	if (data.object.status === 'complete') {
		try {
			const result = await updateSchoolStripeData({
				schoolId: data.object.metadata.schoolId,
				stripePaymentId: data?.object.id,
				stripeData: JSON.stringify({
					stripePaymentId: data?.object.id,
					schoolId: data.object.metadata.schoolId,
					userId: data.object.metadata.userId,
					paymentDate: new Date(data.object.created * 1000).toISOString()
				})
			});
			console.log('DID something cool........:', result);
		} catch (error) {
			console.error('Error storing stripe data', error);
		}
	}

	return json({ success: true, message: 'Stripe payment successful', data });
};
