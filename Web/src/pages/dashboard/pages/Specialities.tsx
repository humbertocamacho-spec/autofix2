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
  const [current, setCurrent] = useState<Specialities | null>(null);

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
  const handleCreate = () => {
    setCurrent({ id: 0, name: "" });
    setOpenModal(true);
  };

  const handleEdit = (item: Specialities) => {
    setCurrent(item);
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!current) return;

    const isNew = current.id === 0;

    const url = isNew
      ? `${VITE_API_URL}/api/specialities`
      : `${VITE_API_URL}/api/specialities/${current.id}`;

    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al guardar la especialidad");
        return;
      }

      alert(isNew ? "Especialidad creada" : "Especialidad actualizada");
      setOpenModal(false);
      fetchSpecialities();
    } catch (error) {
      console.error("Error saving speciality:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta especialidad?")) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/specialities/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error eliminando especialidad");
        return;
      }

      alert("Especialidad eliminada");
      fetchSpecialities();
    } catch (error) {
      console.error("Error deleting speciality:", error);
    }
  };


  const filtered = specialities.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("specialities_screen.title")}</h1>

      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder={t("specialities_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
          onClick={handleCreate}
        >
          {t("specialities_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("specialities_screen.loading")}</p>
        ) : (
          <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left min-w-[500px]">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-16">{t("specialities_screen.table.id")}</th>
                  <th className="pb-3">{t("specialities_screen.table.name")}</th>
                  <th className="pb-3 text-right pr-8">{t("specialities_screen.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-right space-x-3 pr-6">
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                        onClick={() => handleEdit(item)}
                      >
                        {t("specialities_screen.edit")}
                      </button>

                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        {t("specialities_screen.delete")}
                      </button>
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
          </div>
        )}
      </div>
      {openModal && current && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-xl">

            <h2 className="text-2xl font-bold mb-4">
              {current.id === 0
                ? t("specialities_screen.modal.create_title")
                : t("specialities_screen.modal.edit_title")}
            </h2>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600">
                {t("specialities_screen.modal.name")}
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                value={current.name}
                onChange={(e) =>
                  setCurrent({ ...current, name: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setOpenModal(false)}
              >
                {t("specialities_screen.modal.cancel")}
              </button>

              <button
                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6]"
                onClick={handleSave}
              >
                {t("specialities_screen.modal.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
