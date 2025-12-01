import { API_URL} from '@env';

export async function getPartnerSpecialities() {
  try {
    const res = await fetch(`${API_URL}/api/partner_specialities`);
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
