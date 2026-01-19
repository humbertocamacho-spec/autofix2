import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Modules } from "../../../types/modules";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";
import { authFetch } from "../../../utils/authFetch";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { fetchModules(); }, []);

  // Fetch modules list
  const fetchModules = async () => {
    try {
      const res = await authFetch(`${VITE_API_URL}/api/modules`);
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  //Client-side form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t("modules_screen.table.name_error");
    }

    if (!description.trim()) {
      newErrors.description = t("modules_screen.table.description_error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create or update module
  const handleSave = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${VITE_API_URL}/api/modules/${currentModule!.id}`
      : `${VITE_API_URL}/api/modules`;

    try {
      const res = await authFetch(url, {
        method,
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
  
  // Delete module
  const handleDelete = async (module: Modules) => {
    const confirmed = window.confirm(t("modules_screen.confirm.delete", { name: module.name }));
    if (!confirmed) return;

    const res = await authFetch(
      `${VITE_API_URL}/api/modules/${module.id}`,
      { method: "DELETE" }
    );

    if (!res.ok) { alert(t("modules_screen.errors.delete")); return;}

    alert(t("modules_screen.success.delete"));
    fetchModules();
  };

  // Open create modal
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentModule(null);
    setName("");
    setDescription("");
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  // Open edit modal
  const openEditModal = (mod: Modules) => {
    setIsEditing(true);
    setCurrentModule(mod);
    setName(mod.name);
    setDescription(mod.description || "");
    setErrors({});
    setSubmitted(false);
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

      {/* Search input and create button */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("modules_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_modules">
          <button onClick={openCreateModal} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
            {t("modules_screen.add_button")}
          </button>
        </Can>
      </div>

      {/* Modules table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("modules_screen.loading")}</p>
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
                  <tr key={mod.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{mod.id}</td>
                    <td className="py-3">{mod.name}</td>
                    <td className="py-3">{mod.description ?? "—"}</td>
                    <td className="py-3 text-right space-x-3">
                      <Can permission="update_modules">
                        <button onClick={() => openEditModal(mod)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                          {t("modules_screen.edit")}
                        </button>
                      </Can>

                      <Can permission="delete_modules">
                        <button onClick={() => handleDelete(mod)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                          {t("modules_screen.delete")}
                        </button>
                      </Can>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">{t("modules_screen.no_results")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / edit module modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("modules_screen.edit_module") : t("modules_screen.create_module")}
            </h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("modules_screen.table.name")}</RequiredLabel>
                <input
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.name ? "border-red-500" : "border-gray-300"}`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                  placeholder="Ej. Gestión de Partners"
                />
                {submitted && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <RequiredLabel required>{t("modules_screen.table.description")}</RequiredLabel>
                <textarea
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.description ? "border-red-500" : "border-gray-300"}`}
                  rows={3}
                  value={description}
                  onChange={(e) => {  setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: "" })); }}
                  placeholder="Ej. Permite administrar talleres, especialidades y certificaciones"
                />
                {submitted && errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  closeModal();
                  setErrors({});
                  setSubmitted(false);
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("modules_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_modules" : "create_modules"}>
                <button onClick={handleSave} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("modules_screen.save") : t("modules_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
