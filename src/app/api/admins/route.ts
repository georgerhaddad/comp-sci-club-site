import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/server/db/schema";
import { allowedAdmins } from "@/server/db/schema/admins";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function getSessionAndAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { session: null, admin: null };
  }

  const admin = await db
    .select()
    .from(allowedAdmins)
    .where(eq(allowedAdmins.email, session.user.email))
    .limit(1);

  return { session, admin: admin[0] || null };
}

export async function GET() {
  const { session, admin } = await getSessionAndAdmin();

  if (!session || !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await db.select().from(allowedAdmins);
  return NextResponse.json(admins);
}

export async function POST(request: Request) {
  const { session, admin } = await getSessionAndAdmin();

  if (!session || !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!admin.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { githubId, githubUsername, email } = await request.json();

  if (!githubId || !githubUsername) {
    return NextResponse.json(
      { error: "githubId and githubUsername are required" },
      { status: 400 }
    );
  }

  try {
    await db.insert(allowedAdmins).values({
      githubId,
      githubUsername,
      email,
      addedBy: admin.githubUsername,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to add admin. They may already exist." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { session, admin } = await getSessionAndAdmin();

  if (!session || !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!admin.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { githubId } = await request.json();

  if (!githubId) {
    return NextResponse.json(
      { error: "githubId is required" },
      { status: 400 }
    );
  }

  if (githubId === admin.githubId) {
    return NextResponse.json(
      { error: "Cannot remove yourself" },
      { status: 400 }
    );
  }

  await db.delete(allowedAdmins).where(eq(allowedAdmins.githubId, githubId));

  return NextResponse.json({ success: true });
}
