import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Profile } from '../types';

export const useSubscription = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<Profile['subscription_status'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('subscription_status')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setSubscriptionStatus(data?.subscription_status || 'free');
            } catch (err: any) {
                console.error('Error fetching subscription:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const redirectToCheckout = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} ${errorText}`);
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('Checkout URL not returned');
            }

        } catch (err) {
            console.error('Error redirecting to checkout:', err);
            alert('Failed to start checkout');
        }
    };

    // Wait, I need to fix the backend to return URL or install stripe-js.
    // I'll update the backend to return `url` which is `session.url`.

    const redirectToPortal = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('stripe_customer_id')
                .eq('id', user.id)
                .single();

            if (!profile?.stripe_customer_id) {
                alert('No billing account found');
                return;
            }

            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: profile.stripe_customer_id,
                }),
            });

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            }
        } catch (err) {
            console.error('Error redirecting to portal:', err);
            alert('Failed to open portal');
        }
    };

    return {
        subscriptionStatus,
        loading,
        error,
        redirectToCheckout, // This needs to be implemented correctly
        redirectToPortal,
    };
};
