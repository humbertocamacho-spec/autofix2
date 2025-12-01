import { Cars } from "@backend-types/car";
import { API_URL} from '@env';

export async function getCars() {
    try {
        const res = await fetch(`${API_URL}/api/car`);

        if (!res.ok) {
            console.error(`Error HTTP: ${res.status}`);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("Error en getCars:", error);
        return [];
    }
}

export async function createCar(carData: Cars) {
  try {
    const res = await fetch(`${API_URL}/api/car`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carData)
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, message: json.message || "Error al crear vehículo" };
    }

    return { ok: true, ...json };
  } catch (error: any) {
    console.error("Error en createCar:", error);
    return { ok: false, message: error.message };
  }
}

export async function updateCar(id: number, carData: Cars) {
  try {
    const res = await fetch(`${`${API_URL}/api/car`}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carData)
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, message: json.message || "Error al actualizar vehículo" };
    }

    return { ok: true, ...json };
  } catch (error: any) {
    console.error("Error en updateCar:", error);
    return { ok: false, message: error.message };
  }
}

export async function deleteCar(id: number) {
    try {
        const res = await fetch(`${`${API_URL}/api/car`}/${id}`, { method: "DELETE" });
        return await res.json();
    } catch (error) {
        console.error("Error en deleteCar:", error);
        return { ok: false };
    }
}

