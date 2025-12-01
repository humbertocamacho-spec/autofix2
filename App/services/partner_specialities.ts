export async function getPartnerSpecialities() {
  try {
    const res = await fetch("https://prolific-happiness-production.up.railway.app/api/partner_specialities");
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
