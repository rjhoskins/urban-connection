import Stripe from 'stripe';
import { dev } from '$app/environment';
import { TEST_STRIPE_PRODUCTS, PROD_STRIPE_PRODUCTS, PRICE_KEY_MAP } from '$lib/server/constants';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL_SANDBOX, PUBLIC_FRONTEND_URL_PROD } from '$env/static/public';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
const baseUrl = dev ? PUBLIC_FRONTEND_URL_SANDBOX : PUBLIC_FRONTEND_URL_PROD;
const stripeProdMode = dev ? 'dev' : 'prod'; // causing issues in prod?
const secretKey = STRIPE_SECRET_KEY;
const isLive = process.env.STRIPE_MODE === 'live';

const product = TEST_STRIPE_PRODUCTS[0]; // testing...
isLive ? PROD_STRIPE_PRODUCTS[0] : TEST_STRIPE_PRODUCTS[0];

const cancel_url = new URL('/cancel', baseUrl);

const stripe = new Stripe(secretKey as string);
console.log('Stripe initialized with key:', secretKey?.substring(0, 8) + '...');
console.log('Creating checkout session with stripeProdMode', stripeProdMode);

export const POST: RequestHandler = async (event) => {
	const { key, userId, schoolId, success_url } = (await event.request.json()) as {
		key: keyof typeof PRICE_KEY_MAP;
		userId: string;
		schoolId: string;
		success_url: string;
	};
	console.log('Creating checkout session......................', {
		// price: PRICE_KEY_MAP[`${key}`].test, // price id => do key lookup based on key on prod vs test (from constants based on Stripe setup)
		price: isLive ? PRICE_KEY_MAP[`${key}`].live : PRICE_KEY_MAP[`${key}`].test, // price id => do key lookup based on key on prod vs test (from constants based on Stripe setup)
		userId,
		schoolId,
		success_url
	});
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				//allow for multiple products but only buy one at a time
				price: PRICE_KEY_MAP[`${key}`].test,
				quantity: 1
			}
		],
		mode: 'payment',
		success_url,
		metadata: {
			schoolId,
			userId: event.locals.user?.id || 'anonymous'
		},
		cancel_url: cancel_url.toString()
	});
	console.log('Checkout session created:', session);

	if (!session.url) error(500, 'Checkout session URL not found');
	// redirect(303, session.url);

	return json({ url: session.url });
};
