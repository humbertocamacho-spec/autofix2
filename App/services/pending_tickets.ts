import { API_URL } from '@/config/env';
import { authFetch } from "@/utils/authFetch";

const BASE_URL = `${API_URL}/pending_tickets`;

export async function createPendingTicket(data: any) {
  try {
    const res = await authFetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      console.error("Error creando pending_ticket:", await res.text());
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error creando pending_ticket:", error);
    return null;
  }
}

export async function getPendingTicketsByClient(client_id: number) {
  try {
    const res = await authFetch(`${BASE_URL}/${client_id}`);

    if (!res.ok) {
      console.error("Error trayendo pending tickets:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error trayendo pending tickets:", error);
    return [];
  }
}

export async function deletePendingTicket(id: number) {
  if (!id || isNaN(id)) {
    console.error("deletePendingTicket: ID inválido", id);
    return false;
  }

  try {
    const res = await authFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Error eliminando pending_ticket:", await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error eliminando pending_ticket:", error);
    return false;
  }
}

export async function updatePendingTicket(id: number, data: any) {
  try {
    const res = await authFetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Error actualizando pending_ticket:", await res.text());
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error en updatePendingTicket:", error);
    return null;
  }
}
