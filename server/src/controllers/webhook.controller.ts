import type { FastifyRequest, FastifyReply } from 'fastify';
import { stripe } from '../config/stripe';
import { ENV } from '../config/env';
import * as userService from '../services/user.service';

export const handleStripeWebhook = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const sig = request.headers['stripe-signature'] as string;

    if (!sig) {
        return reply.status(400).send({ error: 'Missing stripe-signature header' });
    }

    if (!ENV.STRIPE_WEBHOOK_SECRET) {
        request.log.error('STRIPE_WEBHOOK_SECRET is not configured');
        return reply.status(500).send({ error: 'Webhook not configured' });
    }

    let event;
    try {
        // Fastify передаёт raw body через rawBody (настроено в app.ts)
        const rawBody = request.rawBody;
        if (!rawBody) {
            return reply.status(400).send({ error: 'Missing raw body' });
        }
        event = stripe.webhooks.constructEvent(rawBody, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        request.log.error(`Webhook signature verification failed: ${err}`);
        return reply.status(400).send({ error: 'Webhook signature verification failed' });
    }

    // Обработка события
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_email;

        if (email) {
            try {
                await userService.upgradeToPro(email);
                request.log.info(`User ${email} upgraded to Pro via Stripe webhook`);
            } catch (err) {
                request.log.error(`Failed to upgrade user ${email}: ${err}`);
                return reply.status(500).send({ error: 'Failed to process webhook' });
            }
        } else {
            request.log.warn('checkout.session.completed event without customer_email');
        }
    }

    return reply.status(200).send({ received: true });
};
