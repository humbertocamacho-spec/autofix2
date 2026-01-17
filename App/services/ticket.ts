import { Ticket } from "@backend-types/ticket";
import { API_URL } from "../config/env";
import { authFetch } from "../utils/authFetch";

const BASE_URL = `${API_URL}/api/ticket`;


export async function getConfirmedTickets(): Promise<Ticket[]> {
  try {
    const res = await authFetch(`${BASE_URL}/app`);

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
    const res = await authFetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(ticketData),
    });

    if (!res.ok) {
      console.error("Error creando ticket:", await res.text());
      return { ok: false };
    }

    return { ok: true, data: await res.json() };
  } catch (error) {
    console.error("Error en createTicket:", error);
    return { ok: false };
  }
}

export async function deleteTicket(id: number): Promise<boolean> {
  try {
    const res = await authFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    return res.ok;
  } catch (error) {
    console.error("Error eliminando ticket:", error);
    return false;
  }
}

export async function getOccupiedHours(
  partner_id: number,
  date: string
): Promise<string[]> {
  try {
    const res = await authFetch(
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
