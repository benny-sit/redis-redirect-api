import { createClient } from 'redis';
import 'dotenv/config';

console.log('IS REDIS REMOTE', process.env.IS_REDIS_REMOTE);

const url =
  process.env.IS_REDIS_REMOTE?.trim() === 'true'
    ? process.env.REDIS_URL
    : process.env.NODE_ENV === 'production'
    ? 'redis://redis:6379'
    : '';

export const redisClient = createClient({
  url,
}).on('error', (err) => console.log('Redis Client Error', err));

export const redisConnect = async () => {
  await redisClient.connect();
  console.log('---- Redis Connect Successful ' + url + ' ----');
};

// TO CHECK
// await client.set('key1', 'value');
// const value = await client.get('key1');
// await client.disconnect();
