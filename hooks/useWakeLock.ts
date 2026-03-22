'use client';

import { useEffect, useRef } from 'react';

/**
 * Requests Screen Wake Lock to prevent display sleep during active gameplay.
 * Releases automatically on visibility change (tab blur) or unmount.
 */
export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.wakeLock) return;

    const request = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch {
        // Ignore (e.g. not allowed, or already active)
      }
    };

    const release = () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        request();
      } else {
        release();
      }
    };

    request();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      release();
    };
  }, [enabled]);
}
