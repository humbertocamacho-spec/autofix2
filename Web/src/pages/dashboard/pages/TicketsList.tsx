import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { PendingTicket } from "../../../types/pending_ticket";

export default function PendingTicketsTable() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<PendingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPendingTickets();
  }, []);

  const fetchPendingTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/pending_tickets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching pending tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets
    .filter((t) =>
      (t.partner_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.client_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      t.id.toString().includes(search)
    )
    .sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("pending_tickets_table.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("pending_tickets_table.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("pending_tickets_table.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-14">{t("pending_tickets_table.table.id")}</th>
                  <th className="pb-3 w-48">{t("pending_tickets_table.table.client")}</th>
                  <th className="pb-3 w-40">{t("pending_tickets_table.table.car")}</th>
                  <th className="pb-3 w-48">{t("pending_tickets_table.table.partner")}</th>
                  <th className="pb-3 w-40">{t("pending_tickets_table.table.date")}</th>
                  <th className="pb-3 w-28">{t("pending_tickets_table.table.time")}</th>
                  <th className="pb-3">{t("pending_tickets_table.table.notes")}</th>
                  <th className="pb-3 w-32 text-right">{t("pending_tickets_table.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{item.client_name || `${t("pending_tickets_table.client")} #${item.client_id}`}</td>
                    <td className="py-3">{item.car_name || `${t("pending_tickets_table.car")} #${item.car_id}`}</td>
                    <td className="py-3 flex items-center gap-3">
                      <img src={item.logo_url || "/images/no-logo.png"} className="h-8 w-8 rounded-full border"/>
                      <span>{item.partner_name}</span>
                    </td>
                    <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3">{item.time || "—"}</td>
                    <td className="py-3 max-w-xs whitespace-normal">{item.notes || "—"}</td>
                    <td className="py-3 text-right space-x-3">
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm">
                        {t("pending_tickets_table.edit")}
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                        {t("pending_tickets_table.delete")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      {t("pending_tickets_table.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
