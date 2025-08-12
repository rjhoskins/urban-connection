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
			type: data.object.object,
			stripe_charge_id: data.object.latest_charge,
			payment_amount: data.object.amount / 100,
			payment_currency: data.object.currency,
			payment_status: data.object.status,
			payment_date: new Date(data.object.created * 1000).toISOString()
		};
		try {
			// do something with stripeData...
		} catch (error) {
			console.error('Error storing stripe data', error);
		}
	}

	// console.log('POST Payment success endpoint reached', stripeData);
	return json({ success: true, message: 'Stripe payment successful' });
};
