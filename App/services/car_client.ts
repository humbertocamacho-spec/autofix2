import { API_URL} from '@env';

export async function getCarsByClient(client_id: number) {
    try {
        const res = await fetch(`${API_URL}/api/car_clients/client/${client_id}`);
        return await res.json();
    } catch (error) {
        console.error("Error en getCarsByClient:", error);
        return [];
    }
}
