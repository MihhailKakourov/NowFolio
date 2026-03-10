import type { FastifyInstance } from 'fastify';
import * as paymentController from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth';

interface PaymentRequestBody {
    email: string;
    userId: string;
}

export async function paymentRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: PaymentRequestBody }>('/create-checkout-session', { preHandler: authMiddleware }, paymentController.createCheckoutSession);
}
