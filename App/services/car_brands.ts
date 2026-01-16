import { API_URL } from "@/config/env";
import { authFetch } from "@/utils/authFetch";

export async function getCarBrands() {
  try {
    const res = await authFetch(`${API_URL}/api/car_brands`);

    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getCarBrands:", error);
    return [];
  }
}
