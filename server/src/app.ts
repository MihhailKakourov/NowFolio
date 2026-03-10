import Fastify, { type FastifyInstance } from 'fastify';

import cors from '@fastify/cors';
import { paymentRoutes } from './routes/payment.routes';
import { userRoutes } from './routes/user.routes';
import { webhookRoutes } from './routes/webhook.routes';
import { ENV } from './config/env';

declare module 'fastify' {
  interface FastifyRequest {
    rawBody?: Buffer;
  }
}

export const buildApp = (): FastifyInstance => {
  const fastify: FastifyInstance = Fastify({ logger: true });

  // Парсинг raw body для Stripe webhook
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req, body, done) => {
      try {
        // Сохраняем raw body для Stripe webhook
        req.rawBody = body as Buffer;
        const json = JSON.parse(body.toString());
        done(null, json);
      } catch (err: unknown) {
        done(err as Error, undefined);
      }
    }
  );

  // CORS — только разрешённые домены
  fastify.register(cors, {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  });

  // Маршруты
  fastify.register(webhookRoutes);  // Webhook до auth — без JWT
  fastify.register(paymentRoutes);
  fastify.register(userRoutes);

  // Health Check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date()
    };
  });

  return fastify;
};