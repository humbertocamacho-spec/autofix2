import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Admin } from "../../../types/admin";
import type { User } from "../../../types/users";
import { useTranslation } from "react-i18next";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";

export default function AdminsTable() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const { t } = useTranslation();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userId) { newErrors.userId = t("admin_screen.table.user_error");}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreate = () => {
    setIsEditing(false);
    setCurrentAdmin(null);
    setUserId(null);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const openEdit = (admin: Admin) => {
    setIsEditing(true);
    setCurrentAdmin(admin);
    setUserId(admin.user_id);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const saveAdmin = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const isEdit = isEditing && currentAdmin;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${VITE_API_URL}/api/admins/${currentAdmin!.id}` : `${VITE_API_URL}/api/admins`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!res.ok) {
      alert(t( isEdit ? "admin_screen.errors.update" : "admin_screen.errors.create"));
      return;
    }

    alert(t( isEdit ? "admin_screen.success.update" : "admin_screen.success.create"));

    setOpenModal(false);
    fetchAdmins();
  };

  const deleteAdmin = async (admin: Admin) => {
    const confirmed = window.confirm( t("admin_screen.confirm.deactivate", { name: admin.user_name }));
    if (!confirmed) return;

    const res = await fetch(`${VITE_API_URL}/api/admins/${admin.id}`, { method: "DELETE",});

    if (!res.ok) { alert(t("admin_screen.errors.deactivate")); return;}

    alert(t("admin_screen.success.deactivate"));
    fetchAdmins();
  };

  const filtered = admins.filter((a) => a.user_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("admin_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("admin_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_admins">
          <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6]">
            {t("admin_screen.add_button")}
          </button>
        </Can>
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
                    <Can permission="update_admins">
                      <button onClick={() => openEdit(item)} className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                        {t("admin_screen.edit")}
                      </button>
                    </Can>

                    <Can permission="delete_admins">
                      <button onClick={() => deleteAdmin(item)} className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        {t("admin_screen.delete")}
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">{t("admin_screen.no_results")}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800"> {isEditing ? t("admin_screen.edit_title") : t("admin_screen.create_title")}</h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("admin_screen.choose_user")}</RequiredLabel>
                <select
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.userId ? "border-red-500" : "border-gray-300"}`}
                  value={userId || ""}
                  onChange={(e) => { setUserId(Number(e.target.value)); setErrors((prev) => ({ ...prev, userId: "" })); }}
                >
                  <option value="">{t("admin_screen.choose_user")}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {submitted && errors.userId && (
                  <p className="text-red-500 text-xs mt-1"> {errors.userId}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                onClick={() => { setOpenModal(false); setErrors({}); setSubmitted(false); }}>
                {t("admin_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_admins" : "create_admins"}>
                <button onClick={saveAdmin} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("admin_screen.save") : t("admin_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
