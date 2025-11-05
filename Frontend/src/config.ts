import Constants from 'expo-constants';

const { manifest2, manifest } = Constants as any;
const debuggerHost = manifest2?.extra?.expoGo?.developer?.host ?? manifest?.debuggerHost;
const host = debuggerHost?.split(':').shift();

// Si no logra detectar la IP, pon una por defecto
export const API_URL = host ? `http://${host}:5001` : 'http://192.168.0.118:5001';
