import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Ticket } from "../../../types/ticket";
import { useAuthContext } from "../../../context/AuthContext";
import Can from "../../../components/Can";
import { authFetch } from "../../../utils/authFetch";

export default function TicketsTable() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState<"pendiente" | "revision" | "finalizado">("pendiente");

  useEffect(() => {
    if (!user) return;
    fetchTickets();
  }, [user]);

  // Fetch tickets for the user
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await authFetch(`${VITE_API_URL}/api/ticket`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json",},});

      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets by name
  const filtered = tickets
    .filter(
      (t) =>
        (t.client_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (t.partner_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        t.id.toString().includes(search)
    )
    .sort((a, b) => a.id - b.id);

  // Delete ticket
  const deleteTicket = async (id: number) => {
    if (!confirm(t("tickets_screen.confirm_delete"))) return;

    try {
      const token = localStorage.getItem("token");

      const res = await authFetch(`${VITE_API_URL}/api/ticket/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`,},
      });

      const data = await res.json();

      if (res.ok) {
        fetchTickets(); // Actualizar la lista
      } else {
        alert(data.message || "Error al eliminar ticket");
      }
    } catch (error) {
      console.error("Error eliminando ticket:", error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("tickets_screen.title")}</h1>

      {/* Search input */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("tickets_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tickets table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("tickets_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-14">{t("tickets_screen.table.id")}</th>
                  <th className="pb-3 w-48">{t("tickets_screen.table.client")}</th>
                  <th className="pb-3 w-40">{t("tickets_screen.table.car")}</th>
                  <th className="pb-3 w-40">{t("tickets_screen.table.model")}</th>
                  <th className="pb-3 w-40">{t("tickets_screen.table.year")}</th>
                  <th className="pb-3 w-48">{t("tickets_screen.table.partner")}</th>
                  <th className="pb-3 w-40">{t("tickets_screen.table.date")}</th>
                  <th className="pb-3">{t("tickets_screen.table.notes")}</th>
                  <th className="pb-3 w-32"> {t("tickets_screen.table.status")}</th>
                  <th className="pb-3 w-32 text-right">{t("tickets_screen.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{item.client_name}</td>
                    <td className="py-3">{item.car_name}</td>
                    <td className="py-3">{item.model}</td>
                    <td className="py-3">{item.year}</td>
                    <td className="py-3 flex items-center gap-3">
                      <img src={item.logo_url || "/images/no-logo.png"} className="h-8 w-8 rounded-full border" />
                      <span>{item.partner_name}</span>
                    </td>
                    <td className="py-3">{new Date(item.date).toLocaleString("es-MX")}</td>
                    <td className="py-3 max-w-xs whitespace-normal">{item.notes || "—"}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${item.status === "pendiente" && "bg-gray-200 text-gray-700"}
                        ${item.status === "revision" && "bg-yellow-100 text-yellow-700"}
                        ${item.status === "finalizado" && "bg-green-100 text-green-700"}
                      `}
                      >
                        {t(`tickets_screen.status.${item.status}`)}
                      </span>
                    </td>

                    <td className="py-3 text-right space-x-3">
                      <Can permission="update_tickets">
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                          onClick={() => {
                            setCurrentTicket(item);
                            setNewStatus(item.status);
                            setOpenStatusModal(true);
                          }}
                        >
                          {t("tickets_screen.edit")}
                        </button>
                      </Can>

                      <Can permission="delete_tickets">
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                          onClick={() => deleteTicket(item.id)}
                        >
                          {t("tickets_screen.delete")}
                        </button>
                      </Can>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      {t("tickets_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit status modal */}
      {openStatusModal && currentTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("tickets_screen.edit_status")}
            </h2>

            <label className="block text-sm font-medium mb-2">
              {t("tickets_screen.table.status")}
            </label>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
            >
              <option value="pendiente">{t("tickets_screen.status.pendiente")}</option>
              <option value="revision">{t("tickets_screen.status.revision")}</option>
              <option value="finalizado">{t("tickets_screen.status.finalizado")}</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenStatusModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                {t("tickets_screen.common.cancel")}
              </button>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    await fetch(
                      `${VITE_API_URL}/api/ticket/${currentTicket.id}/status`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                      }
                    );

                    setOpenStatusModal(false);
                    fetchTickets();
                  } catch (error) {
                    console.error("Error actualizando status", error);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#27B9BA] text-white"
              >
                {t("tickets_screen.common.save")}

              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
