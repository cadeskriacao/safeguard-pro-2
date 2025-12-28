
import { createClient } from '@supabase/supabase-js';
import { stripe } from '../services/stripe.js';

const getSupabaseAdmin = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Internal Server Error: Service Role Key missing');
    }
    return createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        console.log("Checking environment variables...");
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
        if (!process.env.VITE_SUPABASE_URL) console.error("Missing VITE_SUPABASE_URL");
        if (!process.env.STRIPE_SECRET_KEY) console.error("Missing STRIPE_SECRET_KEY");

        const supabase = getSupabaseAdmin();

        // 1. Get Total Profiles from Supabase
        const { count: totalUsers, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase count error:', error);
            throw error;
        }

        // 2. Get Paying Users (Active Subscriptions) from Stripe
        // Iterate to get accurate count of unique paying customers
        let payingCustomers = new Set();
        let hasMore = true;
        let startingAfter = undefined;

        while (hasMore) {
            const result = await stripe.subscriptions.list({
                status: 'active',
                limit: 100,
                starting_after: startingAfter
            });

            for (const sub of result.data) {
                // If the subscription is active, this customer is paying
                if (typeof sub.customer === 'string') {
                    payingCustomers.add(sub.customer);
                } else if (sub.customer && sub.customer.id) {
                    payingCustomers.add(sub.customer.id);
                }
            }

            if (result.has_more) {
                startingAfter = result.data[result.data.length - 1].id;
            } else {
                hasMore = false;
            }
        }

        const payingCount = payingCustomers.size;

        // 3. Calculate Non-Paying
        const nonPayingCount = Math.max(0, (totalUsers || 0) - payingCount);

        res.status(200).json({
            count: totalUsers || 0,
            paying: payingCount,
            nonPaying: nonPayingCount
        });

    } catch (err: any) {
        console.error('Clients count error:', err);
        res.status(500).json({ error: err.message });
    }
}
