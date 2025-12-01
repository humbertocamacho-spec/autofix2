import { API_URL} from '@env';

export async function getCarBrands() {
    try {
        const res = await fetch(`${API_URL}/api/car_brands`);

        if (!res.ok) {
            console.error(`Error HTTP: ${res.status} al obtener car_brands`);
            return [];
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error en getCardBrands:", error);
        return [];
    }

}
