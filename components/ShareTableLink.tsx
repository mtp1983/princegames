'use client';

import { useState, useCallback } from 'react';

interface ShareTableLinkProps {
  tableId: string;
  inviteCode: string;
  className?: string;
}

export function ShareTableLink({ tableId, inviteCode, className = '' }: ShareTableLinkProps) {
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const directLink = `${baseUrl}/table/${tableId}`;
  const inviteLink = `${baseUrl}/join/${inviteCode}`;

  const copyLink = useCallback(async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTooltip(`Copied ${label}!`);
      setTimeout(() => {
        setCopied(false);
        setTooltip('');
      }, 2000);
    } catch {
      setTooltip('Copy failed');
    }
  }, []);

  const shareViaWeb = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my poker table at The Prince Casino',
          text: `Join my table! Code: ${inviteCode}`,
          url: directLink,
        });
        setTooltip('Shared!');
        setTimeout(() => setTooltip(''), 2000);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyLink(directLink, 'link');
        }
      }
    } else {
      copyLink(directLink, 'link');
    }
  }, [directLink, inviteCode, copyLink]);

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border-2 border-[var(--gold)] bg-black/60 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🔗</span>
        <h3 className="font-bold text-[var(--gold)] text-lg uppercase tracking-wider">
          Share Table — Invite Anyone
        </h3>
      </div>
      <p className="text-sm text-[var(--text-dim)]">
        Send this link so friends can join your table directly.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => copyLink(directLink, 'link')}
          className="px-4 py-2 bg-[var(--gold)]/20 border border-[var(--gold)] rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors font-medium"
        >
          {copied && tooltip ? '✓ Copied!' : 'Copy link'}
        </button>
        <button
          onClick={shareViaWeb}
          className="px-4 py-2 bg-[var(--gold)]/20 border border-[var(--gold)] rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors font-medium"
        >
          Share
        </button>
      </div>
      <div className="text-xs text-[var(--text-dim)] break-all font-mono bg-black/40 p-2 rounded">
        {directLink}
      </div>
      <div className="text-xs text-[var(--text-dim)]">
        Or share invite code: <strong className="text-[var(--gold)]">{inviteCode}</strong>
      </div>
    </div>
  );
}
