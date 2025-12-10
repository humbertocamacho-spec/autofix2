import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Partner } from "../../../types/partner";
import { useTranslation } from "react-i18next";

export default function PartnersTable() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/partners`);
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = partners
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("partners_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("partners_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
          {t("partners_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("partners_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-12">{t("partners_screen.table.id")}</th>
                  <th className="pb-3 w-64">{t("partners_screen.table.name")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.phone")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.whatsapp")}</th>
                  <th className="pb-3">{t("partners_screen.table.location")}</th>
                  <th className="pb-3 w-20 text-center">{t("partners_screen.table.priority")}</th>
                  <th className="pb-3 w-32 text-right">{t("partners_screen.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3 font-semibold">{item.name}</td>
                    <td className="py-3">{item.phone}</td>
                    <td className="py-3">{item.whatsapp}</td>
                    <td className="py-3 max-w-xs whitespace-normal">{item.location}</td>
                    <td className="py-3 text-center">{item.priority}</td>

                    <td className="py-3 text-right space-x-3">
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                        {t("partners_screen.edit")}
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        {t("partners_screen.delete")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      {t("partners_screen.no_results")}
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
