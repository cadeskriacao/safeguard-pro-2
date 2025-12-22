import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());

// Helper to adapt Vercel-style handlers to Express
const adaptHandler = (handler: any) => async (req: any, res: any) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Middleware for parsing JSON, except for webhooks which need raw body
app.use((req, res, next) => {
    if (req.path === '/api/webhooks/stripe') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Dynamic imports to ensure env vars are loaded before modules
// This prevents 'STRIPE_SECRET_KEY is missing' error during static import
const startServer = async () => {
    try {
        const { default: createCheckoutSession } = await import('./api/create-checkout-session.js');
        const { default: createPortalSession } = await import('./api/create-portal-session.js');
        const { default: stripeWebhook } = await import('./api/webhooks/stripe.js');
        const { default: syncSubscription } = await import('./api/sync-subscription.js');

        // Routes
        app.post('/api/create-checkout-session', adaptHandler(createCheckoutSession));
        app.post('/api/create-portal-session', adaptHandler(createPortalSession));
        app.post('/api/webhooks/stripe', adaptHandler(stripeWebhook));
        app.post('/api/sync-subscription', adaptHandler(syncSubscription));

        app.listen(port, () => {
            console.log(`> Local API server running at http://localhost:${port}`);
            console.log('> Environment variables loaded. Server Ready.');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
