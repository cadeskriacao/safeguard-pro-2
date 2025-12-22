import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Profile } from '../types';

export const useSubscription = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState<Profile['subscription_status'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const syncSubscription = async (userId: string, email: string) => {
        try {
            console.log('Syncing subscription status...');
            const response = await fetch('/api/sync-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email }),
            });
            const result = await response.json();
            if (response.ok && result.success && result.data) {
                console.log('Sync successful:', result.data);
                setSubscriptionStatus(result.data.subscription_status);
            }
        } catch (err) {
            console.error('Failed to sync subscription:', err);
        }
    };

    useEffect(() => {
        let mounted = true;

        const fetchSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    if (mounted) setLoading(false);
                    return;
                }

                // Initial fetch from DB
                const { data, error } = await supabase
                    .from('profiles')
                    .select('subscription_status, email')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (mounted) {
                    console.log('DEBUG: Fetched subscription status:', data?.subscription_status);
                    setSubscriptionStatus(data?.subscription_status || 'free');
                }

                // Sync with Stripe in background
                if (user.email) {
                    syncSubscription(user.id, user.email);
                }

                // Subscribe to realtime changes
                const subscription = supabase
                    .channel('profile_subscription')
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${user.id}`,
                        },
                        (payload) => {
                            if (mounted) {
                                console.log('Subscription updated:', payload.new.subscription_status);
                                setSubscriptionStatus(payload.new.subscription_status);
                            }
                        }
                    )
                    .subscribe();

                return () => {
                    supabase.removeChannel(subscription);
                };

            } catch (err: any) {
                console.error('Error fetching subscription:', err);
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        const cleanupPromise = fetchSubscription();

        return () => {
            mounted = false;
        };
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
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (currentUser?.email) {
                    // Try to sync one last time before giving up
                    await syncSubscription(currentUser.id, currentUser.email);
                    // If still failing, then alert
                }
            }

            // Retry fetch
            const { data: profileRetry } = await supabase
                .from('profiles')
                .select('stripe_customer_id')
                .eq('id', user.id)
                .single();

            if (!profileRetry?.stripe_customer_id) {
                alert('No billing account found. Please subscribe first.');
                return;
            }

            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: profileRetry.stripe_customer_id,
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
        redirectToCheckout,
        redirectToPortal,
        checkSubscription: syncSubscription
    };
};
