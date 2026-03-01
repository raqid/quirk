import api from './api.js';
import { saveToken, saveRefreshToken, clearAll } from './storage.js';

export async function register({ identifier, password, referral_code }) {
  const { data } = await api.post('/auth/register', { identifier, password, referral_code });
  return data;
}

export async function verifyOtp({ identifier, otp_code }) {
  const { data } = await api.post('/auth/verify', { identifier, otp_code });
  if (data.access_token) await saveToken(data.access_token);
  if (data.refresh_token) await saveRefreshToken(data.refresh_token);
  return data;
}

export async function resendOtp({ identifier }) {
  const { data } = await api.post('/auth/resend', { identifier });
  return data;
}

export async function login({ identifier, password }) {
  const { data } = await api.post('/auth/login', { identifier, password });
  if (data.access_token) await saveToken(data.access_token);
  if (data.refresh_token) await saveRefreshToken(data.refresh_token);
  return data;
}

export async function logout() {
  try { await api.post('/auth/logout'); } catch {}
  await clearAll();
}
