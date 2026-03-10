import type { FastifyReply, FastifyRequest } from 'fastify';
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

export const syncUser = async (request: FastifyRequest<{ Body: { email: string, slug?: string } }>, reply: FastifyReply) => {
    try {
        const { email, slug } = request.body;
        if (!email) return reply.status(400).send({ error: 'Email is required' });
        const user = await userService.syncUser(email, slug);
        return reply.send(user);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to sync user' });
    }
};

export const getProStatus = async (request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) => {
    try {
        const { email } = request.params;
        const isPro = await userService.getProStatus(email);
        return reply.send({ isPro });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to get pro status' });
    }
};

export const upgradeToPro = async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    try {
        const { email } = request.body;
        if (!email) return reply.status(400).send({ error: 'Email is required' });
        const user = await userService.upgradeToPro(email);
        return reply.send({ isPro: user.isPro });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to upgrade to pro' });
    }
};

export const findEmail = async (request: FastifyRequest<{ Body: { username: string } }>, reply: FastifyReply) => {
    try {
        const { username } = request.body;
        if (!username) return reply.status(400).send({ error: 'Username is required' });
        const email = await userService.findEmailBySlug(username);
        if (!email) return reply.status(404).send({ error: 'User not found' });
        return reply.send({ email });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to find email' });
    }
};
