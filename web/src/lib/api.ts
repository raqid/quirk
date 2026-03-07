import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quirk-backend-production-eb81.up.railway.app/api/v1';

const TOKEN_KEY = 'quirk_access_token';
const REFRESH_KEY = 'quirk_refresh_token';

export function getAccessToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string) {
  Cookies.set(TOKEN_KEY, access, { expires: 1, sameSite: 'lax' });
  Cookies.set(REFRESH_KEY, refresh, { expires: 30, sameSite: 'lax' });
}

export function clearTokens() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_KEY);
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = Cookies.get(REFRESH_KEY);
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error('Refresh failed');

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && Cookies.get(REFRESH_KEY)) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const newToken = await refreshPromise;
      refreshPromise = null;

      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    } catch {
      refreshPromise = null;
      clearTokens();
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json();
}

// Auth
export async function googleSignIn(id_token: string) {
  return apiFetch<{ access_token: string; refresh_token: string; user: { id: string; display_name: string } }>(
    '/auth/oauth/google',
    { method: 'POST', body: JSON.stringify({ id_token }) }
  );
}

// Demo login
export async function demoSignIn() {
  return apiFetch<{ access_token: string; refresh_token: string; user: { id: string; display_name: string } }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ identifier: 'demo@quirk.com', password: 'password' }) }
  );
}

// Profile
export async function fetchProfile() {
  return apiFetch<{ id: string; display_name: string; email: string; avatar_url?: string }>('/profile');
}

export async function fetchProfileStats() {
  return apiFetch<{
    total_uploads: number; total_earned: number; total_referrals: number;
    streak_days: number; tier: string; next_tier: string;
    tier_progress: number; next_tier_uploads: number;
  }>('/profile/stats');
}

export async function fetchPortfolio() {
  return apiFetch<{
    total_earned: number; royalties_this_month: number; royalties_last_month: number;
    trend_percent: number; trend_direction: string;
    photos: { count: number }; videos: { count: number }; audio: { count: number };
  }>('/profile/portfolio');
}

// Tasks
export async function fetchTasks(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
  const query = qs.toString();
  return apiFetch<{ tasks: Array<Record<string, unknown>> }>(`/tasks${query ? `?${query}` : ''}`);
}

export async function fetchTaskCategories() {
  return apiFetch<{ categories: Array<{ category: string; count: number }> }>('/tasks/categories');
}

// Royalties
export async function fetchRoyalties(params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
  const query = qs.toString();
  return apiFetch<{ events: Array<Record<string, unknown>> }>(`/royalties${query ? `?${query}` : ''}`);
}

export async function fetchRoyaltySummary() {
  return apiFetch<{
    total_royalties: number; total_uses: number; this_month: number; companies_count: number;
  }>('/royalties/summary');
}
