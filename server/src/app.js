const fastify = require('fastify')({ logger: true });
require('dotenv').config();

fastify.register(require('@fastify/cors'), { 
  origin: true // В продакшене тут будет адрес фронтенда
});

fastify.get('/', async (request, reply) => {
  return { hello: 'API is running!' }
});

fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    uptime: process.uptime(), // Показывает, сколько секунд сервер работает
    timestamp: new Date() 
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();