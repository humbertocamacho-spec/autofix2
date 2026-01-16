import { API_URL } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getPartnerSpecialities() {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      console.warn("No hay token guardado");
      return [];
    }

    const res = await fetch(`${API_URL}/api/partner_specialities`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Error HTTP: ${res.status} al obtener partner_specialities`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getPartnerSpecialities:", error);
    return [];
  }
}
