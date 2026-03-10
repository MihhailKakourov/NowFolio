import type { FastifyInstance } from 'fastify';
import * as paymentController from '../controllers/payment.controller';

export async function paymentRoutes(fastify: FastifyInstance) {
    fastify.post('/create-checkout-session', paymentController.createCheckoutSession);
}
