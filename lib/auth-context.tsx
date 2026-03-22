'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

export interface AuthUser {
  id: string;
  displayName: string;
  emoji: string;
  chips: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  /** For components that need raw Clerk ID (e.g. API calls) */
  clerkUserId: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { loaded: clerkLoaded } = useClerk();

  const value = useMemo<AuthContextValue>(() => {
    if (!isLoaded || !clerkLoaded) {
      return { user: null, isLoggedIn: false, isLoaded: false, clerkUserId: null };
    }
    if (!clerkUser) {
      return { user: null, isLoggedIn: false, isLoaded: true, clerkUserId: null };
    }
    const displayName =
      clerkUser.firstName ||
      clerkUser.username ||
      clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] ||
      'Player';
    return {
      user: {
        id: clerkUser.id,
        displayName,
        emoji: '♛',
        chips: 1500, // TODO: fetch from DB
      },
      isLoggedIn: true,
      isLoaded: true,
      clerkUserId: clerkUser.id,
    };
  }, [clerkUser, isLoaded, clerkLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
