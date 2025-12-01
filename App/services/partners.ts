import { API_URL} from '@env';

export async function getPartners() {
    try {
        const res = await fetch(`${API_URL}/api/partners`);

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
