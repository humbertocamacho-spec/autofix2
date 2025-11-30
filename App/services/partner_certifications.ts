export async function getPartnerCertifications(partner_id: number) {
  try {
    const res = await fetch(
      `https://prolific-happiness-production.up.railway.app/api/partner_certifications?partner_id=${partner_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`Error HTTP: ${res.status} al obtener partner_certifications`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getPartnerCertifications:", error);
    return [];
  }
}
