import Fastify, { type FastifyInstance } from 'fastify';

import cors from '@fastify/cors';
import { paymentRoutes } from './routes/payment.routes';
import { userRoutes } from './routes/user.routes';

export const buildApp = (): FastifyInstance => {
  const fastify: FastifyInstance = Fastify({ logger: true });

  // Регистрация плагинов
  fastify.register(cors, {
    origin: true
  });

  // Регистрация маршрутов
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