# Recommendations & Hardening

## Completed

- **Next.js** – Upgraded to 14.2.35 (security patches)
- **API rate limiting** – 30 req/min per IP on create & join
- **@vercel/postgres → Neon** – Migrated to `@neondatabase/serverless` + `drizzle-orm/neon-http`
- **Persist tables** – Tables stored in Postgres when `POSTGRES_URL`/`DATABASE_URL` is set; falls back to in-memory otherwise
- **Browser notifications** – “Your turn!” when tab is backgrounded (after permission)
- **Audio toggle** – ♪ Sound button in game page wrapper + cassior’s built-in toggle
- SFX audio, your-turn ping, Play button for seated users

## Optional follow-ups

- **Env vars** – Ensure `POSTGRES_URL`, `NEXT_PUBLIC_CLERK_*` in Vercel env only; `.env*.local` in `.gitignore`
- **Redis rate limiting** – For production at scale, replace in-memory limiter with Upstash Redis
- **NPC churn** – Disabled for DB-backed tables; can be reintroduced via cron or on-read logic
