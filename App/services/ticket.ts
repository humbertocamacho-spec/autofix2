import { Ticket } from "@backend-types/ticket";

const BASE_URL = "https://backend-autofix-production.up.railway.app/api/ticket";

export async function getTickets(car_id: number, partner_id: number, client_id: number) {
    try {
        console.log("getTickets -> IDs recibidos:", { car_id, partner_id, client_id, });

        if (!car_id || !partner_id || !client_id) {
            console.error("IDs inválidos en getTickets:", { car_id, partner_id, client_id, });
            throw new Error("IDs inválidos enviados a getTickets");
        }

        const url = `${BASE_URL}/${car_id}/${partner_id}/${client_id}`;
        console.log("URL solicitada:", url);

        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Error HTTP ${res.status} al obtener el ticket`);
            const errorText = await res.text();
            console.error("Detalles del servidor:", errorText);
            return null;
        }

        const data = await res.json();
        console.log("Ticket obtenido correctamente:", data);

        return data;
    } catch (e) {
        console.error("Error en getTickets:", e);
        return null;
    }
}

export async function createTicket(ticketData: Ticket) {
    try {
        console.log("Enviando ticket:", ticketData);

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketData),
        });

        if (!res.ok) {
            console.error(`Error HTTP ${res.status} al crear el ticket`);
            const errorText = await res.text();
            console.error("Detalles del servidor:", errorText);
            return { ok: false, message: "Error creando ticket" };
        }

        const data = await res.json();
        console.log("Ticket creado correctamente:", data);

        return { ok: true, data };
    } catch (error) {
        console.error("Error creando ticket:", error);
        return { ok: false, message: "Error inesperado en createTicket" };
    }
}

export async function getTicketsByClient(client_id: number) {
    try {
        const res = await fetch(`${BASE_URL}?client_id=${client_id}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error al obtener tickets:", error);
        return [];
    }
}

export async function deleteTicket(id: number) {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });

        return res.ok;
    } catch (e) {
        console.error("Error eliminando ticket:", e);
        return false;
    }
}
export async function getOccupiedHours(partner_id: number, date: string) {
    try {
        const url = `${BASE_URL}/occupied?partner_id=${partner_id}&date=${date}`;
        const res = await fetch(url);

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        
        return data.occupied_hours || [];
    } catch (error) {
        console.error("Error en getOccupiedHours:", error);
        return [];
    }
}
