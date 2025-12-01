import Constants from 'expo-constants';

interface ExpoExtra {
  API_URL: string;
  GOOGLE_API_KEY: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;

export default extra;
