
import Stripe from 'stripe';
import dotenv from 'dotenv';

console.log('Stripe service initialized (lazy).');

// Singleton instance
let stripeInstance: Stripe;

// Lazy initialization function
const getStripe = () => {
    if (!stripeInstance) {
        console.log('Initializing Stripe instance...');

        // Check for key
        if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
            // Try to load env again if missing?
            dotenv.config({ path: '.env.local' });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY is missing.');
            throw new Error('STRIPE_SECRET_KEY is missing');
        }

        try {
            stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
                apiVersion: '2024-12-18.acacia' as any,
                // Let's use the USER's string but catch errors
                typescript: true,
            });
            console.log('Stripe instance created.');
        } catch (e) {
            console.error('Error creating Stripe instance:', e);
            throw e;
        }
    }
    return stripeInstance;
};

// Export a Proxy that forwards all properties to the lazy instance
export const stripe = new Proxy({}, {
    get: (_target, prop) => {
        const instance = getStripe();
        return (instance as any)[prop];
    }
}) as Stripe;
