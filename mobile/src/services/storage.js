import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS: 'quirk_access_token',
  REFRESH: 'quirk_refresh_token',
};

export async function saveToken(token) {
  await SecureStore.setItemAsync(KEYS.ACCESS, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(KEYS.ACCESS);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(KEYS.ACCESS);
}

export async function saveRefreshToken(token) {
  await SecureStore.setItemAsync(KEYS.REFRESH, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(KEYS.REFRESH);
}

export async function clearRefreshToken() {
  await SecureStore.deleteItemAsync(KEYS.REFRESH);
}

export async function clearAll() {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS),
    SecureStore.deleteItemAsync(KEYS.REFRESH),
  ]);
}
