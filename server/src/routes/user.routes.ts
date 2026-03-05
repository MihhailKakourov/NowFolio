import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';

export async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/users', userController.getUsers);
    fastify.post('/users/sync', userController.syncUser);
    fastify.get('/users/:email/pro-status', userController.getProStatus);
    fastify.post('/users/upgrade-pro', userController.upgradeToPro);
}
