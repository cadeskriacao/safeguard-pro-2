import { stripe } from '../services/stripe.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { customerId } = req.body;

            if (!customerId) {
                return res.status(400).json({ error: 'Missing customerId' });
            }

            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${req.headers.origin}/settings`,
            });

            res.status(200).json({ url: session.url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating portal session' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
