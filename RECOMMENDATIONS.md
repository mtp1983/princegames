# Recommendations & Hardening

## Security

- **Next.js** – Current 14.2.18 has known vulnerabilities (CVE-2025-55184, CVE-2025-55183). Upgrade to 14.2.35+ or run `npx fix-react2shell-next`.
- **API rate limiting** – Add rate limiting on `/api/tables` (create, join) to prevent abuse.
- **Env vars** – Ensure `POSTGRES_URL`, `NEXT_PUBLIC_CLERK_*` are set only in Vercel env, never committed.

## Database

- **@vercel/postgres** – Deprecated; Vercel recommends migrating to Neon. See https://neon.com/docs/guides/vercel-postgres-transition-guide.
- **Persist tables** – Table store is in-memory; wire to Drizzle/Postgres for persistence across deploys.

## UX

- **Browser notifications** – Optional “Your turn” notification when tab is backgrounded (after user permission).
- **Sound button visibility** – Cassior has ♪ Sound (top-right); consider adding an audio toggle in the Next.js game wrapper for discoverability when embedded.

## Done

- SFX audio (card, chip, fold, check, win) in cassior.html
- Audio toggle button (♪ Sound / ♪ Muted) in cassior.html
- “Your turn” ping sound when human’s action is requested
- “Play” button on table page for seated users
