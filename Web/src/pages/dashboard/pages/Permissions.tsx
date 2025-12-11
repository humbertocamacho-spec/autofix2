import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Modules } from "../../../types/modules";
import type { Permission } from "../../../types/permission";

export default function PermissionsTable() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Permission | null>(null);
  const [name, setName] = useState("");
  const [moduleId, setModuleId] = useState<number | null>(null);

  useEffect(() => {
    fetchModules();
    fetchPermissions();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/modules`);
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/permissions`);
      const data = await res.json();
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleName = (id: number) =>
    modules.find((m) => m.id === id)?.name || t("permissions_screen.unknown_module");

  const openCreate = () => {
    setIsEditing(false);
    setCurrent(null);
    setName("");
    setModuleId(null);
    setOpenModal(true);
  };

  const openEdit = (perm: Permission) => {
    setIsEditing(true);
    setCurrent(perm);
    setName(perm.name);
    setModuleId(perm.module_id);
    setOpenModal(true);
  };

  const savePermission = async () => {
    if (!name || !moduleId) return alert("Todos los campos son obligatorios.");

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${VITE_API_URL}/api/permissions/${current?.id}`
      : `${VITE_API_URL}/api/permissions`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, module_id: moduleId }),
    });

    setOpenModal(false);
    fetchPermissions();
  };

  const deletePermission = async (id: number) => {
    if (!confirm("¿Eliminar permiso?")) return;

    await fetch(`${VITE_API_URL}/api/permissions/${id}`, {
      method: "DELETE",
    });

    fetchPermissions();
  };


  const filtered = permissions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("permissions_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("permissions_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
        >
          {t("permissions_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("permissions_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">{t("permissions_screen.table.id")}</th>
                  <th className="pb-3">{t("permissions_screen.table.permission")}</th>
                  <th className="pb-3">{t("permissions_screen.table.module")}</th>
                  <th className="pb-3 text-right">{t("permissions_screen.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((perm) => (
                  <tr key={perm.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{perm.id}</td>
                    <td className="py-3">{perm.name}</td>
                    <td className="py-3">{getModuleName(perm.module_id)}</td>
                    <td className="py-3 text-right space-x-3">
                      <button
                        onClick={() => openEdit(perm)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        {t("permissions_screen.edit")}
                      </button>

                      <button
                        onClick={() => deletePermission(perm.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        {t("permissions_screen.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      {t("permissions_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-2000">
          <div className="bg-white w-[450px] p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing
                ? t("permissions_screen.edit_title")
                : t("permissions_screen.create_title")}
            </h2>

            <label className="block text-sm font-medium">{t("permissions_screen.name")}</label>
            <input
              className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />

            <label className="block text-sm font-medium">{t("permissions_screen.module")}</label>
            <select
              className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
              value={moduleId || ""}
              onChange={(e) => setModuleId(Number(e.target.value))}
            >
              <option value="">{t("permissions_screen.select_module")}</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                {t("cancel")}
              </button>

              <button
                onClick={savePermission}
                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg"
              >
                {isEditing ? t("save") : t("create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
