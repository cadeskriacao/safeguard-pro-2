import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function setup() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { stripe } = await import('../services/stripe');

        console.log('Creating product...');
        const product = await stripe.products.create({
            name: 'Assinatura Premium (SaaS)',
        });
        console.log('Product created:', product.id);

        console.log('Creating recurring price...');
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 1000, // $10.00
            currency: 'usd',
            recurring: { interval: 'month' },
        });
        console.log('STRIPE_PRICE_ID=' + price.id);
    } catch (error) {
        console.error('Error:', error);
    }
}

setup();
