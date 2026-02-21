import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { allowedAdmins } from "../src/server/db/schema/admins";
import { env } from "@/env";

const githubIdArg = process.argv[2] || process.env.SEED_GITHUB_ID;
const githubUsernameArg = process.argv[3] || process.env.SEED_GITHUB_USERNAME;
const emailArg = process.argv[4] || process.env.SEED_GITHUB_EMAIL;

if (!githubIdArg || !githubUsernameArg) {
  console.error("Usage: tsx scripts/seed-admin.ts <githubId> <githubUsername> [email]");
  console.error("Or set SEED_GITHUB_ID, SEED_GITHUB_USERNAME, and optionally SEED_GITHUB_EMAIL environment variables");
  console.error("\nTo find your GitHub ID, run: curl https://api.github.com/users/YOUR_USERNAME | jq .id");
  process.exit(1);
}

const githubId = githubIdArg;
const githubUsername = githubUsernameArg;
const email = emailArg;

async function seedSuperAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const db = drizzle(env.DATABASE_URL);

  try {
    await db
      .insert(allowedAdmins)
      .values({
        githubId,
        githubUsername,
        email: email || null,
        isSuperAdmin: true,
        addedBy: "system",
      })
      .onConflictDoNothing();

    console.log(`Super admin seeded successfully:`);
    console.log(`  Username: ${githubUsername}`);
    console.log(`  Email: ${email ? "(redacted)" : "(not set)"}`);
    console.log(`  Super Admin: true`);
  } catch (error) {
    console.error("Failed to seed super admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
