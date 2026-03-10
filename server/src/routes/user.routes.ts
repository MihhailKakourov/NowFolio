import type { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

export async function userRoutes(fastify: FastifyInstance) {
    // Защищённые маршруты (требуют JWT)
    fastify.post<{ Body: { email: string; slug?: string } }>('/users/sync', { preHandler: authMiddleware }, userController.syncUser);
    fastify.get<{ Params: { email: string } }>('/users/:email/pro-status', { preHandler: authMiddleware }, userController.getProStatus);

    // Публичные маршруты (нужны для логина по username)
    fastify.post<{ Body: { username: string } }>('/users/find-email', userController.findEmail);
}
