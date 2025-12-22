
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistration() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Creating user: ${email}`);

    const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Signup error:', error);
        return;
    }

    if (!user) {
        console.error('No user returned');
        return;
    }

    console.log(`User created. ID: ${user.id}`);

    // Wait for trigger to run
    await new Promise(r => setTimeout(r, 2000));

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
    }

    console.log('Profile retrieved:', profile);

    if (profile.subscription_status === 'free') {
        console.log('SUCCESS: Status is free.');
    } else {
        console.error(`FAILURE: Status is ${profile.subscription_status}`);
    }
}

testRegistration();
