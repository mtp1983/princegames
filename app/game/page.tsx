'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';

function GameContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => setMounted(true), []);

  const toggleSound = () => {
    iframeRef.current?.contentWindow?.postMessage('toggleSound', '*');
  };

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-dim)]">Loading game…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="absolute top-4 left-4 z-[200] flex gap-4">
        <Link
          href={tableId ? `/table/${tableId}` : '/lobby'}
          className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black"
        >
          ← {tableId ? 'Back to Table' : 'Lobby'}
        </Link>
        <button
          type="button"
          onClick={toggleSound}
          className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black"
        >
          ♪ Sound
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src="/cassior.html"
        className="w-full h-screen border-0"
        title="Poker Game"
      />
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-dim)]">Loading…</p>
      </main>
    }>
      <GameContent />
    </Suspense>
  );
}
