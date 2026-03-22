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
        <>
          <p className="text-red-400 mb-4">Table not found for code: {code}</p>
          <Link href="/lobby" className="text-[var(--gold)] underline">
            Go to Lobby
          </Link>
        </>
      )}
    </main>
  );
}
