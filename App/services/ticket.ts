import { Ticket } from "@backend-types/ticket";
import { API_URL } from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = `${API_URL}/api/ticket`;

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getConfirmedTickets(): Promise<Ticket[]> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/app`, {
      headers,
    });

    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    return [];
  }
}

export async function createTicket(ticketData: Ticket) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error creando ticket:", errorText);
      return { ok: false };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Error en createTicket:", error);
    return { ok: false };
  }
}

export async function deleteTicket(id: number): Promise<boolean> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    return res.ok;
  } catch (error) {
    console.error("Error eliminando ticket:", error);
    return false;
  }
}

export async function getOccupiedHours(partner_id: number, date: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/occupied?partner_id=${partner_id}&date=${date}`
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.occupied_hours || [];
  } catch (error) {
    console.error("Error en getOccupiedHours:", error);
    return [];
  }
}
