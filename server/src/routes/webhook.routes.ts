import type { FastifyInstance } from 'fastify';
import * as webhookController from '../controllers/webhook.controller';

export async function webhookRoutes(fastify: FastifyInstance) {
    // Stripe Webhook — нужен raw body для верификации подписи
    // НЕ применяем auth middleware — Stripe не передаёт JWT
    fastify.post('/webhook', {
        config: {
            rawBody: true,
        },
    }, webhookController.handleStripeWebhook);
}
