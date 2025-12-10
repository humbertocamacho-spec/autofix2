import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Admin } from "../../../types/admin";
import { useTranslation } from "react-i18next";

export default function AdminsTable() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/admins`);
            const data = await res.json();
            setAdmins(data.admins || []);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = admins.filter((a) =>
        a.user_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">{t("admin_screen.title")}</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder={t("admin_screen.search_placeholder")}
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    {t("admin_screen.add_button")}
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">{t("admin_screen.loading")}</p>
                ) : (
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr className="text-gray-600 border-b">
                                <th className="pb-3">{t("admin_screen.table.id")}</th>
                                <th className="pb-3">{t("admin_screen.table.name")}</th>
                                <th className="pb-3 text-right">{t("admin_screen.table.actions")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2">{item.id}</td>
                                    <td className="py-2">{item.user_name}</td>

                                    <td className="py-2 text-right space-x-4">
                                        <button className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                                            {t("admin_screen.edit")}
                                        </button>
                                        <button className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                                            {t("admin_screen.delete")}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-gray-500">
                                        {t("admin_screen.no_results")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
