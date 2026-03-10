import type { FastifyRequest, FastifyReply } from 'fastify';
import { createClient, type User, type SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

// Расширяем интерфейс запроса для поддержки поля user
declare module 'fastify' {
    interface FastifyRequest {
        user?: User;
    }
}

const getSupabaseAdmin = () => {
    if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_KEY) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
    }
    return createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);
};

let supabaseAdmin: SupabaseClient | null = null;

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        if (!supabaseAdmin) {
            supabaseAdmin = getSupabaseAdmin();
        }

        const response = await supabaseAdmin.auth.getUser(token);
        const user = response.data?.user;
        const error = response.error;

        if (error || !user) {
            return reply.status(401).send({ error: 'Invalid or expired token' });
        }

        // Прикрепляем пользователя к запросу
        request.user = user;
    } catch {
        return reply.status(401).send({ error: 'Authentication failed' });
    }
};
