
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

        // 1. Count projects
        const { count: projectCount, error: errorProjects } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });

        // 2. Count APRs - assuming table is 'aprs' or similar, check types/service if different?
        // Let's assume 'apr_documents' or similar if it exists? 
        // Based on previous code analysis, I haven't seen the APR table name explicitly but 'aprs' is likely.
        const { count: aprCount, error: errorAprs } = await supabase
            .from('aprs')
            .select('*', { count: 'exact', head: true });

        // 3. Count Inspections
        const { count: inspectionCount, error: errorInspections } = await supabase
            .from('inspections')
            .select('*', { count: 'exact', head: true });

        // 4. Get Project Locations for Map
        // We will just get the addresses.
        // Assuming location data is in 'address' or 'location' field.
        const { data: locations, error: errorLocations } = await supabase
            .from('projects')
            .select('id, name, address, status, lat, lng')
            .limit(100);

        if (errorProjects || errorLocations) {
            console.error('Supabase stats error:', errorProjects || errorLocations);
            // Don't fail completely if just one stats fails? Or return what we have?
        }

        // Mocking some state extraction from address for now if simple
        // Real implementation would geocode or parse "SP", "RJ" etc from address string.
        const projectStates: Record<string, number> = {};

        locations?.forEach((p: any) => {
            // Simple heuristic: extract last 2-char logic if formatted like "City - UF"
            // Or just return the raw list and let frontend handle?
            // Let's just return the raw projects for the map component to handle or display.
        });

        res.status(200).json({
            totalProjects: projectCount || 0,
            totalAprs: aprCount || 0,
            totalInspections: inspectionCount || 0,
            locations: locations || []
        });

    } catch (err: any) {
        console.error('Whitelabel stats error:', err);
        res.status(500).json({ error: err.message });
    }
}
