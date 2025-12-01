import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra) {
  throw new Error("Expo extra config is missing. Make sure app.config.js has 'extra' configured.");
}

export const API_URL: string = Constants.expoConfig.extra.API_URL;
export const GOOGLE_API_KEY: string = Constants.expoConfig.extra.GOOGLE_API_KEY;
