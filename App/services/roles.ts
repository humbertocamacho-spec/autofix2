import { Roles } from "@backend-types/roles";
import { API_URL } from "../config/env";

const BASE_URL = `${API_URL}/api/roles`;


export async function getRoles() {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      console.error(`Error HTTP: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getRoles:", error);
    return [];
  }
}

export async function updateUserRole(payload: Roles) {
  try {
    const res = await fetch(`${BASE_URL}/update-role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al actualizar rol:", data.message);
      return { ok: false, message: data.message || "Error desconocido" };
    }

    return data;

  } catch (error) {
    console.error("Error en updateUserRole:", error);
    return { ok: false, message: "Error de conexión con el servidor" };
  }
}
