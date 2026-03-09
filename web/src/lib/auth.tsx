'use client';

import { createContext, use, useState, useEffect, useCallback, type ReactNode } from 'react';
import { googleSignIn, demoSignIn, fetchProfile, setTokens, clearTokens, getAccessToken } from './api';

interface User {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInAsDemo: () => Promise<void>;
  signInOffline: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      // Check for offline demo mode
      if (typeof window !== 'undefined' && localStorage.getItem('quirk_offline_demo')) {
        setUser({ id: 'offline', display_name: 'Guest' } as User);
      }
      setLoading(false);
      return;
    }
    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch {
      // If API is down but we have offline mode, use mock user
      if (typeof window !== 'undefined' && localStorage.getItem('quirk_offline_demo')) {
        setUser({ id: 'offline', display_name: 'Guest' } as User);
      } else {
        clearTokens();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrate(); }, [hydrate]);

  const signInWithGoogle = async (idToken: string) => {
    const data = await googleSignIn(idToken);
    setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
  };

  const signInAsDemo = async () => {
    const data = await demoSignIn();
    setTokens(data.access_token, data.refresh_token);
    setUser(data.user);
  };

  const signInOffline = () => {
    localStorage.setItem('quirk_offline_demo', '1');
    setUser({ id: 'offline', display_name: 'Guest' } as User);
  };

  const signOut = () => {
    clearTokens();
    localStorage.removeItem('quirk_offline_demo');
    setUser(null);
    window.location.href = '/';
  };

  const value = { user, loading, signInWithGoogle, signInAsDemo, signInOffline, signOut };

  // @ts-ignore
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
