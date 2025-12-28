
import { createClient } from '@supabase/supabase-js';

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
        const supabase = getSupabaseAdmin();

        // Count profiles using HEAD to be faster and cheaper
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase count error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ count: count || 0 });

    } catch (err: any) {
        console.error('Clients count error:', err);
        res.status(500).json({ error: err.message });
    }
}
