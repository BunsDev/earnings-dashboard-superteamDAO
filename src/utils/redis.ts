import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('Please add your REDIS URL to .env.local');
}

const uri = process.env.REDIS_URL;

export const redis = new Redis(uri);
