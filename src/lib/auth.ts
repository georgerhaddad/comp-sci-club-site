import { betterAuth } from "better-auth";
import { neon } from '@neondatabase/serverless';
import { db } from "@/server/db/schema";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from 'drizzle-orm';
import { env } from "@/env";

const sql = neon(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: ,
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
  },
  callbacks: {
    async onSignIn(user) {
      const admin = await db
        .select()
        .from(allowedAdmins)
        .where(eq(allowedAdmins.githubId, user.id))
        .limit(1);

      if (admin.length === 0) {
        throw new Error('Unauthorized: Account not in admin allowlist');
      }

      return user;
    },
  },
});