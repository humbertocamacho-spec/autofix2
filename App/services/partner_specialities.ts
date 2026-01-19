import { API_URL } from '@/config/env';
import { authFetch } from '@/utils/authFetch';

export async function getPartnerSpecialities() {
  try {
    const res = await authFetch(`${API_URL}/api/partner_specialities`);

    if (!res.ok) {
      console.error(`Error HTTP: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getPartnerSpecialities:", error);
    return [];
  }
}
