import Stripe from 'stripe';
import { dev } from '$app/environment';
import { TEST_STRIPE_PRODUCTS, PROD_STRIPE_PRODUCTS, PRICE_KEY_MAP } from '$lib/server/constants';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL_SANDBOX, PUBLIC_FRONTEND_URL_PROD } from '$env/static/public';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { compute_alpha } from 'googleapis';
const baseUrl = dev ? PUBLIC_FRONTEND_URL_SANDBOX : PUBLIC_FRONTEND_URL_PROD;
const stripeProdMode = dev ? 'dev' : 'prod'; // causing issues in prod?
const secretKey = process.env.STRIPE_MODE === 'live' ? STRIPE_SECRET_KEY : STRIPE_SECRET_TEST_KEY;
const isLive = process.env.STRIPE_MODE === 'live';
console.log('Stripe mode is live:', isLive);

const product = TEST_STRIPE_PRODUCTS[0]; // testing...

const cancel_url = new URL('/cancel', baseUrl);

const stripe = new Stripe(secretKey as string);
// console.log('Stripe initialized with key:', secretKey?.substring(0, 8) + '...');
console.log('Creating checkout session with stripeProdMode', stripeProdMode);

export const POST: RequestHandler = async (event) => {
	try {
		const { lookupKey, userId, schoolId, success_url } = (await event.request.json()) as {
			lookupKey: string; // Change from keyof typeof PRICE_KEY_MAP to string
			userId: string;
			schoolId: string;
			success_url: string;
		};

		console.log('Received lookupKey:', lookupKey);

		// Validate the key exists in PRICE_KEY_MAP
		if (!lookupKey || !PRICE_KEY_MAP[lookupKey as keyof typeof PRICE_KEY_MAP]) {
			console.error('Invalid lookupKey provided:', lookupKey);
			console.error('Available keys:', Object.keys(PRICE_KEY_MAP));
			return json({ error: 'Invalid product key' }, { status: 400 });
		}

		// Type assertion after validation
		const validKey = lookupKey as keyof typeof PRICE_KEY_MAP;
		const price = isLive ? PRICE_KEY_MAP[validKey]?.live : PRICE_KEY_MAP[validKey]?.test;

		if (!price) {
			console.error('Price not found for key:', validKey, 'isLive:', isLive);
			return json({ error: 'Price configuration error' }, { status: 500 });
		}

		console.log('Using price ID:', price);
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					//allow for multiple products but only buy one at a time
					price: price,
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
		return json({ url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
