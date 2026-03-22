'use client';

import { useState, useRef, useEffect } from 'react';

export interface SoundState {
  music: boolean;
  sfx: boolean;
}

interface SoundMenuProps {
  sound: SoundState;
  onSoundChange: (sound: SoundState) => void;
  className?: string;
}

export function SoundMenu({ sound, onSoundChange, className = '' }: SoundMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const muted = !sound.music && !sound.sfx;
  const label = muted ? '♪ Muted' : '♪ Sound';

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 bg-black/80 border border-[var(--gold)] rounded-lg text-[var(--gold)] text-sm hover:bg-[var(--gold)] hover:text-black transition-colors"
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute top-full right-0 mt-1 py-2 min-w-[140px] bg-black/95 border border-[var(--gold)]/50 rounded-lg shadow-xl z-[300]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onSoundChange({ ...sound, music: !sound.music });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5"
          >
            Music: {sound.music ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onSoundChange({ ...sound, sfx: !sound.sfx });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5"
          >
            SFX: {sound.sfx ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              const m = muted;
              onSoundChange({ music: !m, sfx: !m });
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 border-t border-white/10 mt-1 pt-2"
          >
            {muted ? 'Unmute all' : 'Mute all'}
          </button>
        </div>
      )}
    </div>
  );
}
