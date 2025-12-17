import { API_URL } from '../config/env';

export async function getPartners() {
  try {
    const res = await fetch(`${API_URL}/api/partners/map`);

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
