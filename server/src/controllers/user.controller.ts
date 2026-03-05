import { FastifyReply, FastifyRequest } from 'fastify';
import * as userService from '../services/user.service';

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await userService.getAllUsers();
        return reply.send(users);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch users' });
    }
};
