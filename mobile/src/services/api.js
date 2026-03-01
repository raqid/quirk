import axios from 'axios';
import { getToken, saveToken, getRefreshToken, saveRefreshToken } from './storage.js';

const BASE_URL = 'https://quirk-backend-production-eb81.up.railway.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach access token
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
        await saveToken(data.access_token);
        await saveRefreshToken(data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// ── Uploads ──────────────────────────────────
export async function presignUpload({ filename, content_type, type }) {
  const { data } = await api.post('/uploads/presign', { filename, content_type, type });
  return data;
}

export function uploadToR2(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded / e.total);
      };
    }
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
}

export async function completeUpload({ key, type, category, description, task_id, language }) {
  const { data } = await api.post('/uploads/complete', { key, type, category, description, task_id, language });
  return data;
}

export async function fetchUploads(params = {}) {
  const { data } = await api.get('/uploads', { params });
  return data;
}

export async function fetchUpload(id) {
  const { data } = await api.get(`/uploads/${id}`);
  return data;
}

export async function deleteUpload(id) {
  const { data } = await api.delete(`/uploads/${id}`);
  return data;
}

export async function uploadAsset({ asset, type, category, description, task_id, language, onProgress }) {
  const presign = await presignUpload({ filename: asset.fileName || 'upload', content_type: asset.mimeType || 'application/octet-stream', type });
  onProgress?.(0.1);
  await uploadToR2(presign.upload_url, asset, (p) => onProgress?.(0.1 + p * 0.7));
  onProgress?.(0.85);
  const result = await completeUpload({ key: presign.key, type, category, description, task_id, language });
  onProgress?.(1.0);
  return result;
}

// ── Tasks ─────────────────────────────────────
export async function fetchTasks(params = {}) {
  const { data } = await api.get('/tasks', { params });
  return data;
}

export async function fetchTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
}

// ── Royalties ─────────────────────────────────
export async function fetchRoyalties(params = {}) {
  const { data } = await api.get('/royalties', { params });
  return data;
}

export async function fetchRoyaltySummary() {
  const { data } = await api.get('/royalties/summary');
  return data;
}

// ── Wallet ────────────────────────────────────
export async function fetchWallet() {
  const { data } = await api.get('/wallet');
  return data;
}

export async function fetchTransactions(params = {}) {
  const { data } = await api.get('/wallet/transactions', { params });
  return data;
}

export async function requestWithdrawal(amount) {
  const { data } = await api.post('/wallet/withdraw', { amount });
  return data;
}

// ── Portfolio ─────────────────────────────────
export async function fetchPortfolio() {
  const { data } = await api.get('/profile/portfolio');
  return data;
}

// ── Profile ───────────────────────────────────
export async function fetchProfile() {
  const { data } = await api.get('/profile');
  return data;
}

export async function fetchProfileStats() {
  const { data } = await api.get('/profile/stats');
  return data;
}

export async function updateProfile(updates) {
  const { data } = await api.patch('/profile', updates);
  return data;
}

export async function updatePayoutMethod({ type, details }) {
  const { data } = await api.patch('/profile/payout-method', { type, details });
  return data;
}

// ── Notifications ─────────────────────────────
export async function fetchNotifications(params = {}) {
  const { data } = await api.get('/notifications', { params });
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await api.patch('/notifications/read-all');
  return data;
}

// ── Referrals ─────────────────────────────────
export async function fetchReferrals() {
  const { data } = await api.get('/referrals');
  return data;
}

export async function applyReferralCode(referral_code) {
  const { data } = await api.post('/referrals/apply', { referral_code });
  return data;
}

export default api;
