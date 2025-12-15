import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Specialities } from "../../../types/specialities";

export default function SpecialitiesTable() {
  const { t } = useTranslation();
  const [specialities, setSpecialities] = useState<Specialities[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Specialities | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/specialities`);
      const data = await res.json();
      setSpecialities(data);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch(`${VITE_API_URL}/api/specialities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      setOpenModal(false);
      fetchSpecialities();
    } catch (error) {
      console.error("Error creating specialities:", error);
    }
  };

  const handleUpdate = async () => {
    if (!current) return;

    try {
      await fetch(`${VITE_API_URL}/api/specialities/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      setOpenModal(false);
      fetchSpecialities();
    } catch (error) {
      console.error("Error updating speciality:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta especialidad?")) return;

    try {
      await fetch(`${VITE_API_URL}/api/specialities/${id}`, {
        method: "DELETE",
      });

      fetchSpecialities();
    } catch (error) {
      console.error("Error deleting speciality:", error);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setName("");
    setCurrent(null);
    setOpenModal(true);
  };

  const openEditModal = (item: Specialities) => {
    setIsEditing(true);
    setCurrent(item);
    setName(item.name);
    setOpenModal(true);
  };

  const filtered = specialities.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("specialities_screen.title")}</h1>
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("specialities_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={openCreateModal} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
          {t("specialities_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("specialities_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-20">{t("specialities_screen.table.id")}</th>
                  <th className="pb-3">{t("specialities_screen.table.name")}</th>
                  <th className="pb-3 text-right w-48 pr-6">{t("specialities_screen.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3 truncate">{item.name}</td>
                    <td className="py-3 text-right pr-6">
                      <div className="flex justify-end space-x-2">
                      <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                        {t("specialities_screen.edit")}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        {t("specialities_screen.delete")}
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      {t("specialities_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing
                ? t("specialities_screen.edit")
                : t("specialities_screen.add_button")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">{t("specialities_screen.table.name")}</label>

                <input className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]" value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => setOpenModal(false)}>
                {t("specialities_screen.cancel")}
              </button>

              <button onClick={isEditing ? handleUpdate : handleCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                {isEditing
                  ? t("specialities_screen.save")
                  : t("specialities_screen.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
