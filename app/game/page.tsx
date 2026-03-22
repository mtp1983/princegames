'use client';

import { useEffect } from 'react';

/**
 * Unified mode: /game redirects to join flow.
 * Everyone joins a table and plays with NPCs and humans.
 */
export default function GamePage() {
  useEffect(() => {
    window.location.href = '/join';
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <p className="text-[var(--gold)]">Joining a table…</p>
    </main>
  );
}
