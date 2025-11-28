export async function createPendingTicket(data: any) {
    try {
        const res = await fetch("https://backend-autofix-production.up.railway.app/api/pending_tickets/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (error) {
        console.error("Error creando pending_ticket:", error);
        return null;
    }
}

export async function getPendingTicketsByClient(client_id: number) {
  try {
    const res = await fetch(
      `https://backend-autofix-production.up.railway.app/api/pending_tickets/${client_id}`
    );
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
    const res = await fetch(
      `https://backend-autofix-production.up.railway.app/api/pending_tickets/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const text = await res.text();
      console.log(`Error en DELETE (status ${res.status}):`, text);
      return false;
    }

    const data = await res.json();
    console.log("DELETE response:", data);
    return true;
  } catch (error) {
    console.error("Error eliminando pending_ticket:", error);
    return false;
  }
}

export async function updatePendingTicket(id: number, data: any) {
  try {
    const res = await fetch(
      `https://backend-autofix-production.up.railway.app/api/pending_tickets/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

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
