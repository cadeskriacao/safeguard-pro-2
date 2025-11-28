import Stripe from 'stripe';

import dotenv from 'dotenv';

// Ensure env vars are loaded
if (!process.env.STRIPE_SECRET_KEY) {
    dotenv.config({ path: '.env.local' });
}

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is missing. Available keys:', Object.keys(process.env));
    throw new Error('STRIPE_SECRET_KEY is missing');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover', // Use latest or pinned version
    typescript: true,
});
