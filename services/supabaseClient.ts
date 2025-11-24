/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    console.error('❌ Missing Supabase environment variables:', missing.join(', '));
    console.error('📝 Please configure these variables in your Vercel project settings:');
    console.error('   Settings → Environment Variables');

    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}. Please configure them in Vercel Settings → Environment Variables.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
