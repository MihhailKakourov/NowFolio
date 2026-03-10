import Fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
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
  const allowedOrigins = [ENV.CLIENT_URL, 'http://localhost:5173', 'https://nowfolio-frontend.onrender.com'];
  fastify.register(cors, {
    origin: (origin, cb) => {
      // Допускаем запросы без origin (например, от Stripe Webhooks или Postman)
      if (!origin) {
        cb(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        fastify.log.warn(`CORS blocked request from origin: ${origin}`);
        cb(new Error('Not allowed by CORS'), false);
      }
    },
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

  // Раздача статики (Frontend)
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../client/dist'),
    prefix: '/',
    wildcard: false, // Отключаем wildcard, чтобы API маршруты работали корректно
  });

  // SPA Fallback: все остальные GET запросы (не API) отдают index.html
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith('/api') ||
      request.url.startsWith('/users') ||
      request.url.startsWith('/webhook') ||
      request.url.startsWith('/create-checkout-session')) {
      return reply.status(404).send({ error: 'Route not found' });
    }
    return reply.sendFile('index.html');
  });

  return fastify;
};