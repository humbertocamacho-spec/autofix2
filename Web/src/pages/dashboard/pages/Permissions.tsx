import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Modules } from "../../../types/modules";
import type { Permission } from "../../../types/permission";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);


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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Este campo es obligatorio";
    if (!moduleId) newErrors.moduleId = "Este campo es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const getModuleName = (id: number) =>
    modules.find((m) => m.id === id)?.name ||
    t("permissions_screen.unknown_module");

  const openCreate = () => {
    setIsEditing(false);
    setCurrent(null);
    setName("");
    setModuleId(null);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const openEdit = (perm: Permission) => {
    setIsEditing(true);
    setCurrent(perm);
    setName(perm.name);
    setModuleId(perm.module_id);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const savePermission = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

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

        <Can permission="create_permissions">
          <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
            {t("permissions_screen.add_button")}
          </button>
        </Can>
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
                      <Can permission="update_permissions">
                        <button onClick={() => openEdit(perm)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                          {t("permissions_screen.edit")}
                        </button>
                      </Can>

                      <Can permission="delete_permissions">
                        <button onClick={() => deletePermission(perm.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                          {t("permissions_screen.delete")}
                        </button>
                      </Can>
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("permissions_screen.edit_title") : t("permissions_screen.create_title")}
            </h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("permissions_screen.name")}</RequiredLabel>

                <input className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-[#27B9BA]`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                  placeholder="Ej. create_users"
                />

                {submitted && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <RequiredLabel required>{t("permissions_screen.module")}</RequiredLabel>

                <select
                  className={`w-full px-3 py-2 rounded-lg border bg-white  ${submitted && errors.moduleId ? "border-red-500" : "border-gray-300"}  focus:ring-2 focus:ring-[#27B9BA]`}
                  value={moduleId || ""}
                  onChange={(e) => { setModuleId(Number(e.target.value)); setErrors((prev) => ({ ...prev, moduleId: "" })); }}
                >
                  <option value="">{t("permissions_screen.select_module")}</option>

                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {submitted && errors.moduleId && (
                  <p className="text-red-500 text-xs mt-1">{errors.moduleId}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => { setOpenModal(false); setErrors({}); setSubmitted(false); }}>
                {t("permissions_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_permissions" : "create_permissions"}>
                <button onClick={savePermission} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("permissions_screen.save") : t("permissions_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
