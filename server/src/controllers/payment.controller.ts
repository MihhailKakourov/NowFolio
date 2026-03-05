import { FastifyRequest, FastifyReply } from 'fastify';
import * as paymentService from '../services/payment.service';

interface PaymentRequestBody {
    email: string;
    userId: string;
}

export const createCheckoutSession = async (
    request: FastifyRequest<{ Body: PaymentRequestBody }>,
    reply: FastifyReply
) => {
    const { email, userId } = request.body;

    if (!email || !userId) {
        return reply.status(400).send({ error: 'Missing email or userId' });
    }

    try {
        const sessionData = await paymentService.createCheckoutSession(email, userId);
        return reply.send(sessionData);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Stripe session creation failed' });
    }
};
