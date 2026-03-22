# Requirements

## Table & Game Flow

1. **Table creation requires login** – Anonymous users cannot create tables. Create button redirects to login if not signed in.

2. **Tables viewable anonymously** – Anyone can view a table (and the game) without signing in.

3. **Table page shows game at all times** – Visiting `/table/[id]` shows the interactive poker game (cassior) full screen. No separate lobby view on the table page.

4. **Server seeds one table on startup** – When no tables exist, the first `GET /api/tables` creates and seeds a "Main Table" so there is always at least one playable table.

5. **Tables stored in database** – Tables and state persist in Postgres (when `POSTGRES_URL` is set). Falls back to in-memory when not configured.

6. **Create table auto-seats user** – Creating a table automatically seats the creating user at the table.

7. **Join flow** – "Join a Table Now" (home) or shared invite link:
   - Brings user to first available table URL (`/table/[id]`)
   - Shows "Sit at Table" overlay before they can interact
   - "Sit at Table" redirects to login if not signed in (with return URL)
   - When logged in, joins and seats the user

8. **404 handling** – Missing tables and unknown routes show a clear 404 with a "Back to Home" link.

9. **Active player count** – Home page and table page show actual active players (human + NPC) from table status, not a fixed "9 Players".

10. **Turn timeout** – If a seated user doesn't respond in time (timer expires), they fold the round, are removed from the table, and no longer appear active.
