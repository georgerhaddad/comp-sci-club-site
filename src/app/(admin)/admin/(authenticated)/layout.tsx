import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/server/db/schema";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LogoutButton } from "../_components/logout-button";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const admin = await db
    .select()
    .from(allowedAdmins)
    .where(eq(allowedAdmins.email, session.user.email))
    .limit(1);

  if (admin.length === 0) {
    redirect("/admin/login?error=unauthorized");
  }

  const isSuperAdmin = admin[0].isSuperAdmin ?? false;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold">
              Admin Console
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/events"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Events
              </Link>
              <Link
                href="/admin/projects"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Projects
              </Link>
              {isSuperAdmin && (
                <Link
                  href="/admin/settings/admins"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Manage Admins
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                  width={48}
                  height={48}
                />
              )}
              <span className="text-sm">{session.user.name}</span>
              {isSuperAdmin && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  Super Admin
                </span>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <Toaster />
    </div>
  );
}
