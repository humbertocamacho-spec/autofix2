import { API_URL } from '../config/env';
import { authFetch } from "../utils/authFetch";

const BASE_URL = `${API_URL}/api/car_clients`;

export async function getCarsByClient(client_id: number) {
    try {
        const res = await authFetch(`${BASE_URL}/client/${client_id}`);
        return await res.json();
    } catch (error) {
        console.error("Error en getCarsByClient:", error);
        return [];
    }
}
