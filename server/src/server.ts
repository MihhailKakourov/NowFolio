import { buildApp } from './app';
import { ENV } from './config/env';

const start = async () => {
    const fastify = buildApp();
    try {
        const port = ENV.PORT;
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Server listening on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
