import Stripe from 'stripe';
import { ENV } from './env';

if (!ENV.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
