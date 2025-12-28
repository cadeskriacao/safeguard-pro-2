
import { createClient } from '@supabase/supabase-js';
import { geocodeAddress } from '../services/geocoding';

// Admin client to bypass RLS
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') { // Allow GET for easy triggering via browser
        res.setHeader('Allow', 'POST, GET');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        // 1. Fetch projects without coordinates
        const { data: projects, error } = await supabaseAdmin
            .from('projects')
            .select('id, address')
            .is('lat', null)
            .not('address', 'is', null);

        if (error) throw error;

        if (!projects || projects.length === 0) {
            return res.status(200).json({ message: 'No projects to geocode.' });
        }

        console.log(`Geocoding ${projects.length} projects...`);

        let updatedCount = 0;
        const results = [];

        // 2. Iterate and geocode
        for (const project of projects) {
            if (!project.address) continue;

            const coords = await geocodeAddress(project.address);
            if (coords) {
                const { error: updateError } = await supabaseAdmin
                    .from('projects')
                    .update({ lat: coords.lat, lng: coords.lng })
                    .eq('id', project.id);

                if (!updateError) {
                    updatedCount++;
                    results.push({ id: project.id, address: project.address, ...coords, status: 'updated' });
                } else {
                    console.error(`Failed to update project ${project.id}:`, updateError);
                    results.push({ id: project.id, error: updateError.message });
                }
            } else {
                console.warn(`Could not geocode: ${project.address}`);
                results.push({ id: project.id, address: project.address, status: 'not_found' });
            }

            // Basic rate limiting prevention (rarely needed for small batches but good practice)
            await new Promise(r => setTimeout(r, 100));
        }

        res.status(200).json({
            message: `Processed ${projects.length} projects. Updated ${updatedCount}.`,
            details: results
        });

    } catch (err: any) {
        console.error('Sync coordinates error:', err);
        res.status(500).json({ error: err.message });
    }
}
