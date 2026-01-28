import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra) {
  throw new Error("Expo extra config is missing. Make sure app.config.js has 'extra' configured.");
}

export const API_URL: string = process.env.EXPO_PUBLIC_API_URL ?? 'https://fallback.autofix.lat';

export const GOOGLE_API_KEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? '';

export const GOOGLE_API_KEY_IOS: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS ?? '';

console.log("API_URL usada:", API_URL);