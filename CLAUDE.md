# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build with Turbopack
pnpm lint             # Run ESLint
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run Drizzle migrations
pnpm db:push          # Push schema to database (no migration files)
pnpm seed:admin <githubId> <githubUsername> [email]  # Seed initial super admin
```

To find a GitHub ID for seeding: `curl https://api.github.com/users/USERNAME | jq .id`

## Architecture

**Stack**: Next.js 16 (App Router with Turbopack), React 19, Drizzle ORM, Neon (PostgreSQL), Better Auth, Upstash Redis (caching), UploadThing (file uploads), Tailwind CSS 4

**Route Groups**:
- `src/app/(public)/` - Public-facing pages with Navbar layout
- `src/app/(admin)/admin/` - Admin dashboard with authentication
- `src/app/api/` - API routes including Better Auth handlers at `/api/auth/[...all]`

**Database Schema** (`src/server/db/schema/`):
- `events.ts` - Events, images, locations, timelines, timeline markers
- `auth.ts` - Better Auth tables (user, session, account, verification)
- `admins.ts` - Allowlist of GitHub IDs permitted to authenticate as admins
- `index.ts` - Drizzle client with Upstash Redis caching

**Authentication Flow**:
Better Auth with GitHub OAuth. Only GitHub accounts in the `allowed_admins` table can create accounts (enforced via `databaseHooks.account.create.before` in `src/lib/auth.ts`).

**Path Alias**: `@/*` maps to `./src/*`

**Environment**: Validated with `@t3-oss/env-nextjs` in `src/env.js`. Required server vars: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

**UI Components**: Radix UI primitives in `src/components/ui/`, using `class-variance-authority` for variants and `tailwind-merge` for class merging. Use `npx shadcn@latest add <component>` to add new components.

## Partial Prerendering (PPR)

This project uses `cacheComponents: true` in `next.config.ts` which enables Partial Prerendering.

**How PPR Works:**
- Routes are prerendered into a static HTML shell sent immediately to the browser
- Dynamic content streams in as it becomes ready
- Combines static site speed with dynamic rendering flexibility

**Three Content Types:**

1. **Static** - Renders at build time automatically (pure computations, sync I/O)

2. **Cached** (`use cache`) - Dynamic content included in static shell:
   ```tsx
   async function BlogPosts() {
     'use cache'
     cacheLife('hours')
     const posts = await fetch('...').then(r => r.json())
     return <section>{/* render */}</section>
   }
   ```

3. **Dynamic** (Suspense) - Streams at request time:
   ```tsx
   export default function Page() {
     return (
       <>
         <h1>Static header</h1>
         <Suspense fallback={<Skeleton />}>
           <DynamicContent />  {/* Data fetching inside */}
         </Suspense>
       </>
     )
   }

   async function DynamicContent() {
     const data = await fetchData()  // Fetching INSIDE Suspense boundary
     return <div>{data}</div>
   }
   ```

**Critical Pattern for PPR:**
- Data fetching must happen INSIDE the Suspense boundary, not at the page level
- Wrong: `const data = await fetch()` at page level, then `<Suspense><Component data={data}/></Suspense>`
- Right: Page returns static shell + Suspense with async component that fetches its own data

**Non-cacheable (require Suspense):** `cookies()`, `headers()`, `searchParams`
