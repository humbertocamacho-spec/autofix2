import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/env';
import { Partner } from '@backend-types/partner';

export async function getPartners(): Promise<Partner[]> {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error("No se encontró token");

    const res = await fetch(`${API_URL}/api/partners`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Error HTTP: ${res.status} al obtener partners`);
      return [];
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error en getPartners:", error);
    return [];
  }
}
