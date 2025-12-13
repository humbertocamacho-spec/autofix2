import { API_URL } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Partner } from '@backend-types/partner';

export async function getPartners(): Promise<Partner[]> {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error("No se encontró token");

    const res = await fetch(`${API_URL}/api/partners`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al obtener partners");

    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error en getPartners:", error);
    return [];
  }
}
