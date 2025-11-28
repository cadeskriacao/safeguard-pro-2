import { stripe } from '../../services/stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

// Disable body parser to verify signature
export const config = {
    api: {
        bodyParser: false,
    },
};

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                buf,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as any;
                    const userId = session.metadata.userId;
                    const subscriptionId = session.subscription;
                    const customerId = session.customer;

                    // Retrieve subscription to get status and price
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    await supabase
                        .from('profiles')
                        .update({
                            stripe_customer_id: customerId,
                            subscription_status: subscription.status,
                            price_id: subscription.items.data[0].price.id,
                        })
                        .eq('id', userId);
                    break;
                }
                case 'customer.subscription.updated': {
                    const subscription = event.data.object as any;
                    // Find user by stripe_customer_id
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('stripe_customer_id', subscription.customer)
                        .single();

                    if (profiles) {
                        await supabase
                            .from('profiles')
                            .update({
                                subscription_status: subscription.status,
                                price_id: subscription.items.data[0].price.id,
                            })
                            .eq('id', profiles.id);
                    }
                    break;
                }
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object as any;
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('stripe_customer_id', subscription.customer)
                        .single();

                    if (profiles) {
                        await supabase
                            .from('profiles')
                            .update({
                                subscription_status: 'canceled',
                            })
                            .eq('id', profiles.id);
                    }
                    break;
                }
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            res.json({ received: true });
        } catch (err) {
            console.error('Error processing webhook:', err);
            res.status(500).json({ error: 'Webhook handler failed' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
