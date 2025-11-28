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

            const { sessionId } = await response.json();
            if (!sessionId) throw new Error('Session ID not returned');

            // Redirect to Stripe Checkout using the session ID
            // Since we are using a backend session creation, we typically redirect to the URL provided by Stripe
            // But here we got a sessionId. We need Stripe.js on the frontend to redirect with sessionId
            // OR we can just return the URL from the backend.
            // Let's check create-checkout-session.ts. It returns sessionId.
            // We need to use stripe.redirectToCheckout({ sessionId }) from @stripe/stripe-js
            // OR change the backend to return the url.
            // Changing backend to return url is easier for now to avoid installing @stripe/stripe-js if not needed.
            // But standard way is stripe.redirectToCheckout.
            // Let's assume we can use the URL approach if we update the backend.
            // Actually, let's update the backend to return `url` as well, or just use the sessionId with a simple redirect if possible?
            // No, sessionId requires Stripe.js.
            // Let's update backend to return `url` (session.url).

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
