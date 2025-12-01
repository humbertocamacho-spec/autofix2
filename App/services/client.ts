import { API_URL} from '@env';

export async function getClients() {
    try {
        const res = await fetch(`${API_URL}/api/client`);

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