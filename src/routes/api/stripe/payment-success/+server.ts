import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface StripeData {
	stripe_payment_id: string;

	type: string;
	stripe_charge_id: string;
	payment_amount: number;
}

export const POST: RequestHandler = async (event) => {
	// console.log('POST Payment success endpoint reached');
	// const { userId } = event.locals.auth();
	// if (!userId) {
	// 	console.error('User not authenticated ===> exiting');
	// 	error(400, 'User not authenticated');
	// }

	const { request } = event;
	const body = await request.json();
	let stripeData: StripeData | {} = {};

	const { data } = body;
	if (data.object.status === 'complete') {
		stripeData = {
			stripe_payment_id: data.object.id,
			userId: data.metadata.userId,
			schoolId: data.metadata.schoolId,
			payment_date: new Date(data.object.created * 1000).toISOString()
		};

		try {
			// do something with stripeData...
			console.log('Doing something with Stripe data........:', stripeData);
		} catch (error) {
			console.error('Error storing stripe data', error);
		}
	}

	// console.log('POST Payment success endpoint reached', stripeData);
	return json({ success: true, message: 'Stripe payment successful' });
};
