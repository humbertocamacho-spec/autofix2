import { API_URL } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getPartners() {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.log('No hay token guardado');
      return [];
    }

    const res = await fetch(`${API_URL}/api/partners`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Error backend:', text);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Error en getPartners:', error);
    return [];
  }
}
