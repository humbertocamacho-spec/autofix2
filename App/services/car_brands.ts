export async function getCarBrands() {
    try {
        const res = await fetch("https://backend-autofix-production.up.railway.app/api/car_brands");

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
