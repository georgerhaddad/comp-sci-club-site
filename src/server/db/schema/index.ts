import { env } from '@/env';
import { Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import { upstashCache } from "drizzle-orm/cache/upstash";

declare global {
  var __neonPool: Pool | undefined;
}

const pool = globalThis.__neonPool ?? new Pool({
  connectionString: env.DATABASE_URL!,
});

if (process.env.NODE_ENV !== "production") {
  globalThis.__neonPool = pool;
}

export const db = drizzleHttp(env.DATABASE_URL!, {
  cache: upstashCache({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
    config: { ex: 3600 }
  }),
});

export const dbTx = drizzleServerless(pool);
