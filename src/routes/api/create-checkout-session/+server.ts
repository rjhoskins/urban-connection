import Stripe from 'stripe';
import { dev } from '$app/environment';
import { TEST_STRIPE_PRODUCTS, PROD_STRIPE_PRODUCTS } from '$lib/constants';
import { STRIPE_SECRET_KEY, STRIPE_SECRET_TEST_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL_SANDBOX, PUBLIC_FRONTEND_URL_PROD } from '$env/static/public';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
const baseUrl = dev ? PUBLIC_FRONTEND_URL_SANDBOX : PUBLIC_FRONTEND_URL_PROD;
const secretKey = dev ? STRIPE_SECRET_TEST_KEY : STRIPE_SECRET_KEY;
const ngrokUrl = 'https://872700b78225.ngrok-free.app';
// const baseUrl = dev ? 'localhost:5173' : ngrokUrl; // For local https development
const product = TEST_STRIPE_PRODUCTS[0]; // testing...
const success_url = new URL('/?purchaseRedirect=true', baseUrl);
const cancel_url = new URL('/cancel', baseUrl);

const stripe = new Stripe(secretKey as string);

export const POST: RequestHandler = async (event) => {
	const { price } = await event.request.json();
	console.log('Creating checkout session......................');
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				//allow for multiple products but only buy one at a time
				price,
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: success_url.toString(),
		cancel_url: cancel_url.toString()
	});
	console.log('Checkout session created:', session);

	if (!session.url) error(500, 'Checkout session URL not found');
	// redirect(303, session.url);

	return json({ url: session.url });
};
