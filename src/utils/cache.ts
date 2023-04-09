import { redis } from '@/utils/redis';

const fetch = async <T>(key: string, fetcher: () => T) => {
  const existing = await get<T>(key);
  if (existing !== null) return existing;
  return set(key, fetcher);
};

const get = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(key);
  if (value === null) return null;
  return JSON.parse(value);
};

const set = async <T>(key: string, fetcher: () => T): Promise<T> => {
  const value = await fetcher();
  await redis.set(key, JSON.stringify(value));
  return value;
};

const cache = { fetch, get, set };
export default cache;
