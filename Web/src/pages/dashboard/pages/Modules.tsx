import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Modules } from "../../../types/modules";

export default function ModulesTable() {
  const { t } = useTranslation();
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState<Modules | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/modules`);
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("El nombre es obligatorio");

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${VITE_API_URL}/api/modules/${currentModule!.id}`
      : `${VITE_API_URL}/api/modules`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (data.ok) {
        fetchModules();
        closeModal();
      } else {
        alert(data.message || "Error");
      }
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este módulo?")) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/modules/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.ok) {
        fetchModules();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentModule(null);
    setName("");
    setDescription("");
    setOpenModal(true);
  };

  const openEditModal = (mod: Modules) => {
    setIsEditing(true);
    setCurrentModule(mod);
    setName(mod.name);
    setDescription(mod.description || "");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };


  const filtered = modules.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("modules_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("modules_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
        >
          {t("modules_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            {t("modules_screen.loading")}
          </p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">{t("modules_screen.table.id")}</th>
                  <th className="pb-3">{t("modules_screen.table.name")}</th>
                  <th className="pb-3">{t("modules_screen.table.description")}</th>
                  <th className="pb-3 text-right">{t("modules_screen.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((mod) => (
                  <tr
                    key={mod.id}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="py-3">{mod.id}</td>
                    <td className="py-3">{mod.name}</td>
                    <td className="py-3">{mod.description ?? "—"}</td>
                    <td className="py-3 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(mod)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        {t("modules_screen.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(mod.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        {t("modules_screen.delete")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      {t("modules_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing
                ? t("modules_screen.edit_module")
                : t("modules_screen.create_module")}
            </h2>

            <div className="mb-4">
              <label className="block mb-1">{t("modules_screen.table.name")}</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Module name"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1">
                {t("modules_screen.table.description")}
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                {t("modules_screen.cancel")}
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg"
              >
                {isEditing
                  ? t("modules_screen.save")
                  : t("modules_screen.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
