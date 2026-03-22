'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function JoinByCodePage() {
  const params = useParams();
  const code = params.code as string;
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading');

  useEffect(() => {
    if (!code) {
      setStatus('notfound');
      return;
    }
    fetch(`/api/tables/invite/${code}`)
      .then((res) => {
        if (res.ok) return res.json();
        setStatus('notfound');
        return null;
      })
      .then((table) => {
        if (table?.id) {
          setStatus('found');
          window.location.href = `/table/${table.id}`;
        } else {
          setStatus('notfound');
        }
      })
      .catch(() => setStatus('notfound'));
  }, [code]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {status === 'loading' && (
        <p className="text-[var(--gold)]">Finding table…</p>
      )}
      {status === 'found' && (
        <p className="text-[var(--gold)]">Redirecting to table…</p>
      )}
      {status === 'notfound' && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--gold)] mb-2">Table not found</h1>
          <p className="text-[var(--text-dim)] mb-6">
            Invite code &quot;{code}&quot; doesn&apos;t match any table.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:opacity-90"
          >
            ← Back to Home
          </Link>
        </div>
      )}
    </main>
  );
}
