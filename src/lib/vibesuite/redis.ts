import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KEY_PREFIX = 'vsm:';

export function redisKey(parts: string): string {
  return `${KEY_PREFIX}${parts}`;
}
