import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra) {
  throw new Error("Expo extra config is missing. Make sure app.config.js has 'extra' configured.");
}

// config/env.ts
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL: string = rawApiUrl ?? 'https://fallback.autofix.lat (ENV NO CARGADO)';

export const GOOGLE_API_KEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? 'NO_KEY';

export const GOOGLE_API_KEY_IOS: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS ?? 'NO_KEY_IOS';
