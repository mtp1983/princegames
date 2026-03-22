# Accessibility

## Theme & Contrast

The app respects the OS color scheme (`prefers-color-scheme`) for light/dark mode. Auth pages (login, sign-in, sign-up) use CSS variables that provide WCAG AA–compliant contrast in both modes:

- **Light mode:** Dark text (#0f172a) on light backgrounds (#ffffff, #f8fafc)
- **Dark mode:** Light text (#e2e8f0) on dark backgrounds (#0f172a, #1e293b)

## Clerk Auth Components

Clerk’s `SignIn` and `SignUp` components receive theme-aware variables from `ClerkProvider`:

- `colorForeground`, `colorMutedForeground` – readable in both modes
- `colorBackground`, `colorInput` – appropriate card/input backgrounds
- `colorPrimary` – gold accent (#c9a84c) with sufficient contrast for buttons

## Focus & Keyboard

- “Back” link on login page: visible focus ring (`focus:ring-2 focus:ring-[var(--gold)]`)
- Links and buttons use hover/focus states for discoverability
