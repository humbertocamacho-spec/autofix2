const BASE_URL = "https://prolific-happiness-production.up.railway.app/api/car_clients";

export async function getCarsByClient(client_id: number) {
    try {
        const res = await fetch(`${BASE_URL}/client/${client_id}`);
        return await res.json();
    } catch (error) {
        console.error("Error en getCarsByClient:", error);
        return [];
    }
}
