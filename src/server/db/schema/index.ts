import { env } from '@/env';
import { drizzle } from 'drizzle-orm/neon-http';
import { upstashCache } from "drizzle-orm/cache/upstash";

export const db = drizzle(env.DATABASE_URL!, {
  cache: upstashCache({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
    config: { ex: 3600 }
  }),
});