import { API_URL } from "@/config/env";
import { authFetch } from "@/utils/authFetch";

export async function getProfile() {
  try {
    const res = await authFetch(`${API_URL}/api/auth/me`);
    if (!res.ok) throw new Error("Error cargando perfil");
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("getProfile error:", error);
    return null;
  }
}

export async function updateProfile(profile: any) {
  try {
    const res = await authFetch(`${API_URL}/api/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error guardando perfil");
    return data.user;
  } catch (error: any) {
    console.error("updateProfile error:", error);
    throw error;
  }
}

export async function deleteAccount() {
  try {
    const res = await authFetch(`${API_URL}/api/auth/me`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "No se pudo eliminar la cuenta");
    }
    return true;
  } catch (error: any) {
    console.error("deleteAccount error:", error);
    throw error;
  }
}