'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { PokerTable } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { SitAtTableOverlay } from '@/components/SitAtTableOverlay';
import { ShareTableLink } from '@/components/ShareTableLink';

export default function TablePage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [table, setTable] = useState<PokerTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isSeated = user && table?.seats?.some((s) => s.status === 'human' && s.playerId === user.id);
  const activeCount = table?.seats?.filter((s) => s.status !== 'empty').length ?? 0;

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/tables/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTable(data);
        } else {
          setTable(null);
        }
      } catch {
        setTable(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [id, refreshKey]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'turnTimeout' && user && isSeated) {
        fetch(`/api/tables/${id}/leave`, { method: 'POST' })
          .then((res) => res.ok && setRefreshKey((k) => k + 1))
          .catch(() => {});
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [id, user, isSeated]);

  const toggleSound = () => {
    iframeRef.current?.contentWindow?.postMessage('toggleSound', '*');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <p className="text-[var(--text-dim)]">Loading game…</p>
      </main>
    );
  }

  if (!table) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)]">
        <h1 className="text-2xl font-bold text-[var(--gold)] mb-2">Table not found</h1>
        <p className="text-[var(--text-dim)] mb-6">
          This table may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:opacity-90"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col relative">
      <iframe
        ref={iframeRef}
        src={`/cassior.html?active=${activeCount || 9}`}
        className="w-full h-screen border-0 absolute inset-0"
        title="Poker Game"
      />
      <div className="absolute top-4 left-4 z-[200] flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black"
        >
          ← Home
        </Link>
        <span className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm">
          {activeCount} active
        </span>
        <button
          type="button"
          onClick={toggleSound}
          className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black"
        >
          ♪ Sound
        </button>
        {isSeated && (
          <button
            type="button"
            onClick={() => setShowShare((s) => !s)}
            className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black"
          >
            🔗 Share
          </button>
        )}
      </div>
      {showShare && isSeated && (
        <div className="absolute top-16 left-4 z-[200]">
          <ShareTableLink tableId={table.id} inviteCode={table.inviteCode} />
        </div>
      )}
      <SitAtTableOverlay table={table} />
    </main>
  );
}
