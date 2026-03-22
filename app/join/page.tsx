'use client';

import { useEffect } from 'react';

/** Redirects to first table with an empty seat. */
export default function JoinPage() {
  useEffect(() => {
    fetch('/api/tables')
      .then((res) => res.json())
      .then((tables: Array<{ id: string; seats: Array<{ status: string }> }>) => {
        const withSeat = Array.isArray(tables)
          ? tables.find((t) => t.seats?.some((s) => s.status === 'empty' || s.status === 'npc'))
          : null;
        const target = withSeat ?? tables?.[0];
        if (target?.id) {
          window.location.href = `/table/${target.id}`;
          return;
        }
        window.location.href = '/';
      })
      .catch(() => {
        window.location.href = '/';
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)]">
      <p className="text-[var(--gold)]">Finding a table…</p>
    </main>
  );
}
