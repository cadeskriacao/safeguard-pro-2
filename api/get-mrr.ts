import { stripe } from '../services/stripe.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        let mrr = 0;
        let hasMore = true;
        let startingAfter = undefined;
        const history: Record<string, number> = {};
        const subscriptionsList: { amount: number, created: number }[] = [];
        const breakdown: Record<string, number> = {};

        // Iterate through all active subscriptions to calculate MRR
        while (hasMore) {
            const subscriptions = await stripe.subscriptions.list({
                status: 'active',
                limit: 100,
                starting_after: startingAfter,
                expand: ['data.items.data.price']
            });

            for (const sub of subscriptions.data) {
                let subMrr = 0;

                // Sum up items for this sub
                for (const item of sub.items.data) {
                    const price = item.price;
                    const amount = price.unit_amount || 0;
                    const interval = price.recurring?.interval || 'month';
                    const intervalCount = price.recurring?.interval_count || 1;

                    // Normalize to Monthly
                    let monthlyAmount = amount;
                    if (interval === 'year') {
                        monthlyAmount = amount / 12;
                    } else if (interval === 'week') {
                        monthlyAmount = amount * 4;
                    } else if (interval === 'day') {
                        monthlyAmount = amount * 30;
                    }

                    monthlyAmount = monthlyAmount / intervalCount;
                    monthlyAmount = monthlyAmount * (item.quantity || 1);

                    subMrr += monthlyAmount;

                    mrr += monthlyAmount;

                    // Breakdown (Existing logic)
                    const productName = (typeof item.price.product === 'string')
                        ? item.price.product
                        : (item.price.nickname || 'Unknown Plan');

                    if (!breakdown[productName]) {
                        breakdown[productName] = 0;
                    }
                    breakdown[productName] += monthlyAmount;
                }

                subscriptionsList.push({ amount: subMrr, created: sub.created });
            }

            if (subscriptions.has_more) {
                startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
            } else {
                hasMore = false;
            }
        }

        // Calculate History (Last 12 Months)
        // We will calculate the Accumulated MRR for each of the last 12 months
        // Note: This is a "Survivorship" view (only currently active subs), which is an approximation.
        const months: string[] = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            // Format: "MMM/YY" (e.g., "Dez/25")
            // We'll manually format or use simple logic
            const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            const label = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;

            // End of that month timestamp
            const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime() / 1000;

            // Sum MRR of subs created before/at this month end
            const monthMrr = subscriptionsList
                .filter(s => s.created <= endOfMonth)
                .reduce((sum, s) => sum + s.amount, 0);

            history[label] = monthMrr;
        }

        res.status(200).json({
            mrr: mrr / 100, // Convert cents to main currency unit
            currency: 'brl',
            breakdown: Object.fromEntries(
                Object.entries(breakdown).map(([k, v]) => [k, (v as number) / 100])
            ),
            history: Object.fromEntries(
                Object.entries(history).map(([k, v]) => [k, (v as number) / 100])
            )
        });

    } catch (err: any) {
        console.error('MRR Error:', err);
        res.status(500).json({ error: err.message });
    }
}
