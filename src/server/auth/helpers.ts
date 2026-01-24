"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/server/db/schema";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from "drizzle-orm";

export type AdminInfo = {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  admin: typeof allowedAdmins.$inferSelect | null;
  isSuperAdmin: boolean;
};

/**
 * Gets the current session and admin info.
 * Use this in server actions to check authentication.
 */
export async function getAdminSession(): Promise<AdminInfo> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { session: null, admin: null, isSuperAdmin: false };
  }

  const [admin] = await db
    .select()
    .from(allowedAdmins)
    .where(eq(allowedAdmins.email, session.user.email))
    .limit(1);

  return {
    session,
    admin: admin ?? null,
    isSuperAdmin: admin?.isSuperAdmin ?? false,
  };
}

/**
 * Throws an error if the user is not authenticated as an admin.
 * Use this at the start of server actions that require admin access.
 */
export async function requireAdmin(): Promise<AdminInfo> {
  const info = await getAdminSession();

  if (!info.session || !info.admin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return info;
}

/**
 * Throws an error if the user is not a super admin.
 */
export async function requireSuperAdmin(): Promise<AdminInfo> {
  const info = await requireAdmin();

  if (!info.isSuperAdmin) {
    throw new Error("Forbidden: Super admin access required");
  }

  return info;
}
