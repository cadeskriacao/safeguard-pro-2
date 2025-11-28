import { stripe } from '../services/stripe';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { userId, email } = req.body;

            if (!userId || !email) {
                return res.status(400).json({ error: 'Missing userId or email' });
            }

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                customer_email: email,
                line_items: [
                    {
                        price: process.env.STRIPE_PRICE_ID,
                        quantity: 1,
                    },
                ],
                success_url: `${req.headers.origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/settings`,
                metadata: {
                    userId,
                },
            });

            res.status(200).json({ sessionId: session.id, url: session.url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating checkout session' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
