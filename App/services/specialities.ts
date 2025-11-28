export async function getSpecialities() {
    try {
        const res = await fetch("https://backend-autofix-production.up.railway.app/api/specialities");

        if (!res.ok) {
            console.error(`Error HTTP: ${res.status} al obtener specialities`);
            return [];
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error en getSpecialities:", error);
        return [];
    }
}