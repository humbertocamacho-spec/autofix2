import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra) {
  throw new Error("Expo extra config is missing. Make sure app.config.js has 'extra' configured.");
}

// config/env.ts
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL: string = rawApiUrl ?? 'https://fallback.autofix.lat (ENV NO CARGADO)';

export const GOOGLE_API_KEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? 'NO_KEY';

export const GOOGLE_API_KEY_IOS: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS ?? 'NO_KEY_IOS';

// Logs (visibles en adb logcat o dev tools si es development build)
console.log('[DEBUG ENV] EXPO_PUBLIC_API_URL (raw):', rawApiUrl);
console.log('[DEBUG ENV] API_URL final:', API_URL);
console.log('[DEBUG ENV] Platform:', process.env.EXPO_PUBLIC_PLATFORM);
console.log('[DEBUG ENV] GOOGLE_API_KEY:', GOOGLE_API_KEY);
console.log('[DEBUG ENV] GOOGLE_API_KEY_IOS:', GOOGLE_API_KEY_IOS);