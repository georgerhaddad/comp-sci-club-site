import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db/schema";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import * as authSchema from "@/server/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  databaseHooks: {
    account: {
      create: {
        before: async (account) => {
          if (account.providerId === "github") {
            const admin = await db
              .select()
              .from(allowedAdmins)
              .where(eq(allowedAdmins.githubId, account.accountId))
              .limit(1);
            if (admin.length === 0) {
              return false;
            }
          }
          return { data: account };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
