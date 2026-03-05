import Stripe from 'stripe';
import { ENV } from '../config/env';

export const createCheckoutSession = async (email: string, userId: string) => {
    if (!ENV.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing in .env');
    }

    // Убираем слэш в конце, если он есть, чтобы избежать двойного слэша //
    const clientUrl = ENV.CLIENT_URL.replace(/\/$/, '');

    const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pro Subscription',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${clientUrl}/?success=true`,
        cancel_url: `${clientUrl}/cancel`,
        customer_email: email,
        metadata: {
            userId: userId,
        },
    });

    return { id: session.id, url: session.url };
};
