import { API_URL } from '../config/env';

const BASE_URL = `${API_URL}/api/client`;

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