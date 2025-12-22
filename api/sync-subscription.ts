
import { stripe } from '../services/stripe.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const getSupabaseAdmin = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
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
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { userId, email } = req.body;

    if (!userId && !email) {
        return res.status(400).json({ error: 'Missing userId or email' });
    }

    try {
        const supabase = getSupabaseAdmin();

        // 1. Get user from Supabase
        let query = supabase.from('profiles').select('*');
        if (userId) query = query.eq('id', userId);
        else query = query.eq('email', email);

        const { data: profile, error: profileError } = await query.single();

        if (profileError || !profile) {
            return res.status(404).json({ error: 'User not found in Supabase' });
        }

        // 2. Search customer in Stripe
        const customers = await stripe.customers.list({ email: profile.email, limit: 1 });

        // Default state if no customer/sub
        let updateData = {
            subscription_status: 'free',
            price_id: null,
            stripe_customer_id: profile.stripe_customer_id // Keep existing if valid
        };

        if (customers.data.length > 0) {
            const customer = customers.data[0];
            updateData.stripe_customer_id = customer.id;

            // 3. Get active subscriptions
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'active',
                limit: 1
            });

            if (subscriptions.data.length > 0) {
                const sub = subscriptions.data[0];
                updateData.subscription_status = sub.status;
                updateData.price_id = sub.items.data[0].price.id;
            }
        }

        console.log('Syncing subscription for:', profile.email, updateData);

        // 4. Update Supabase
        const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', profile.id);

        if (updateError) {
            console.error('Supabase update failed:', updateError);
            return res.status(500).json({ error: 'Database update failed: ' + updateError.message });
        }

        res.status(200).json({ success: true, data: updateData });

    } catch (err: any) {
        console.error('Sync error:', err);
        res.status(500).json({ error: err.message });
    }
}
