import { createClient } from 'redis';
const client = createClient({ url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:6379` });
client.on('error', (e)=> console.error('Redis error', e.message));
await client.connect();
export default client;
