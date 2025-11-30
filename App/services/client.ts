const BASE_URL = "https://prolific-happiness-production.up.railway.app/api/client";

export async function getClients() {
    try {
        const res = await fetch(BASE_URL);

        if (!res.ok) {
            console.error(`Error HTTP: ${res.status}`);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("Error en getClients:", error);
        return [];
    }
}