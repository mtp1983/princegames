# Poker Rebuild Plan

## 1. Visual Reference

**Screenshot**: `docs/screenshots/old-game-reference.png`

Use as reference only (do not copy). Key elements:
- Dark void/space aesthetic: black background, faint starfield
- **Pseudo-3D bowl/stadium table**: curved dark brown/bronze shape receding into background
- Gold accents on borders, text, highlights
- 9 seats in elliptical layout; each seat: icon, name, chip count
- Active/dealer seat: gold glow border + "D" badge
- Top: TOTAL POT, phase pill (PRE-FLOP)
- Bottom-left: YOU — [name], Chips, Bet, Hand
- Bottom-right: TABLE TALK log
- Top-right: ♪ SOUND toggle

---

## 2. Design Decisions (Confirmed)

| Decision | Choice |
|----------|--------|
| **Modes** | One unified mode: anyone joins a table, plays with NPCs and humans |
| **Perspective** | Pseudo-3D bowl/stadium table (like a real table) |
| **Branding** | Rebrand — new game name and NPC names |
| **Assets** | No existing images/sfx in repo; create new (or use programmatic SVG/Web Audio) |

---

## 3. Requirements

### Must Have
- **Sound menu** – Toggle sound (Music + SFX or combined). Exposed in game UI.
- **Screen Wake Lock API** – Keep screen awake during active gameplay. Request on game start, release on blur/leave.
- **Pseudo-3D table** – Bowl/stadium curved surface, not flat.
- **Single mode** – Join table → play with NPCs and other humans. No separate solo/table modes.

### Layout (from reference)
- Elliptical seat arrangement around table
- Pot + phase at top center
- Stats (bottom-left), Table Talk (bottom-right)
- Action bar when it's your turn
- Turn timer bar

---

## 4. Tech Stack

**Engine**: React + CSS/SVG + Framer Motion (for pseudo-3D: CSS perspective/transform or canvas gradient paths)

**Pseudo-3D approach**:
- Use CSS `perspective` + `transform` for bowl illusion, or
- SVG/canvas path with radial gradient for curved felt
- Seat positions via polar coordinates around ellipse

---

## 5. Full Rebuild Plan

### Phase 1: Cleanup
1. Remove `index.html` (root marketing site).
2. Remove `public/cassior.html`.
3. Replace iframe in `app/table/[id]/page.tsx` and `app/game/page.tsx` with React `GameView`.

### Phase 2: Core Features
- **Keep Awake**: `navigator.wakeLock?.request('screen')` when game active; release on visibilitychange/blur.
- **Sound menu**: Game-level UI (dropdown or popover) – Music on/off, SFX on/off, or master mute.
- **Assets**: Create or source:
  - Card faces (SVG or sprite sheet)
  - SFX: deal, chip, fold, check, win, your-turn (Web Audio or small .mp3/.ogg)

### Phase 3: Game Component Architecture
```
components/
  game/
    GameView.tsx        → Main container, wake lock, sound menu
    Pseudo3DTable.tsx   → Bowl/stadium table surface
    SeatRing.tsx        → 9 seats in ellipse
    Card.tsx            → Single card (SVG)
    ActionBar.tsx       → Fold, Check, Call, Raise, All In
    PotBox.tsx, PhaseBox.tsx
    StatsPanel.tsx, TableTalk.tsx
    TimerBar.tsx, WinnerOverlay.tsx
lib/
  game/
    poker.ts, ai.ts, types.ts
```

### Phase 4: Unified Table Mode
- `/table/[id]` and `/game` both use same `GameView`.
- `/game` → create/join default table (or first available).
- Seats: humans + NPCs; backend syncs state for humans.

### Phase 5: Rebrand
- New game title (TBD)
- New NPC names and avatars (TBD)

---

## 6. Summary

| Item | Plan |
|------|------|
| **Engine** | React + CSS/SVG + Framer Motion |
| **Table** | Pseudo-3D bowl/stadium |
| **Modes** | One: join table, play with NPCs + humans |
| **Sound** | Menu for toggle (Music/SFX) |
| **Keep Awake** | Screen Wake Lock API in game |
| **Assets** | Create new (no existing images/sfx) |
| **Rebrand** | New names, new title |

---

## 7. NPC Placeholders (Rebrand)

Old names removed. Use new names when designing. Example slots:
| Slot | Name (example) | Style |
|------|----------------|-------|
| 1–8 | *TBD* | tight, loose, aggressive, balanced, maniac, etc. |
