import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import type { User } from "../../../types/users";
import Can from "../../../components/Can";
import { authFetch } from "../../../utils/authFetch";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch users list
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await authFetch(`${VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("No autorizado");
          setUsers([]);
          return;
        }
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }

    } catch (error) {
      console.error(t("users_screen.errors.fetch"), error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Open create modal
  const handleOpenCreate = () => {
    setCurrentUser({
      name: "",
      email: "",
      phone: "",
      address: "",
      role_id: 3,
      gender_id: null,
      photo_url: null,
    } as User);

    setOpenEdit(true);
  };

  // Open edit modal
  const handleOpenEdit = (user: User) => {
    setCurrentUser(user);
    setOpenEdit(true);
  };

  const handleSaveUser = async () => {
    if (currentUser?.id) {
      await handleUpdateUser();
    } else {
      await handleCreateUser();
    }
  };

  // Create user
  const handleCreateUser = async () => {
    if (!currentUser) return;

    try {
      const res = await authFetch(`${VITE_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || t("users_screen.errors.create"));
        return;
      }

      alert(t("users_screen.success.create"));
      setOpenEdit(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (error) {
      console.error(t("users_screen.errors.create"), error);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!currentUser) return;

    try {
      const res = await authFetch(`${VITE_API_URL}/api/users/${currentUser.id}`, {
        method: "PUT",
        body: JSON.stringify(currentUser),
      });

      const data = await res.json();

      if (!res.ok) { alert(data.message || t("users_screen.errors.update"));
        return;
      }

      alert(t("users_screen.success.update"));
      setOpenEdit(false);
      fetchUsers();
    } catch (error) {
      console.error(t("users_screen.errors.update"), error);
    }
  };

  // Delete user
  const handleDeleteUser = async (user: User) => {
    const confirmDelete = window.confirm(
      t("users_screen.confirm.deactivate", { name: user.name })
    );
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${VITE_API_URL}/api/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || t("users_screen.errors.deactivate"));
        return;
      }

      alert(t("users_screen.success.deactivate"));
      fetchUsers();
    } catch (error) {
      console.error(t("users_screen.errors.deactivate"), error);
    }
  };

  // Restore user
  const handleRestoreUser = async (user: User) => {
    const confirmRestore = window.confirm( t("users_screen.confirm.restore", { name: user.name }));
    if (!confirmRestore) return;

    try {
      const res = await authFetch(`${VITE_API_URL}/api/users/${user.id}/restore`, {
        method: "PATCH",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || t("users_screen.errors.restore"));
        return;
      }

      alert(t("users_screen.success.restore"));
      fetchUsers();
    } catch (error) {
      console.error(t("users_screen.errors.restore"), error);
    }
  };

  // Filter users by name
  const filtered = Array.isArray(users)
  ? users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("users_screen.title")}</h1>

      {/* Search input and create button */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("users_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_users">
          <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition" 
          onClick={handleOpenCreate}>
            {t("users_screen.add_button")}
          </button>
        </Can>
      </div>

      {/* Users table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("users_screen.loading")}</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-3">{t("users_screen.table.id")}</th>
                <th className="pb-3">{t("users_screen.table.name")}</th>
                <th className="pb-3">{t("users_screen.table.email")}</th>
                <th className="pb-3">{t("users_screen.table.phone")}</th>
                <th className="pb-3">{t("users_screen.table.role")}</th>
                <th className="pb-3">{t("users_screen.table.status")}</th>
                <th className="pb-3 text-right">{t("users_screen.table.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className={`border-b hover:bg-gray-50 text-gray-700 ${user.deleted_at ? "bg-gray-100 opacity-70" : ""}`}>
                  <td className="py-3">{user.id}</td>
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.phone || "—"}</td>
                  <td className="py-3">{user.role_name || "—"}</td>
                  <td className="py-3">
                    <span
                      title={ user.deleted_at ? t("users_screen.table.status_inactive") : t("users_screen.table.status_active")}
                      className={`inline-block w-3 h-3 rounded-full ${ user.deleted_at ? "bg-red-500" : "bg-green-500"}`}
                    />
                  </td>

                  <td className="py-3 text-right space-x-3">
                    {!user.deleted_at && (
                      <Can permission="update_users">
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                          onClick={() => handleOpenEdit(user)}
                        >
                          {t("users_screen.edit")}
                        </button>
                      </Can>
                    )}

                    {!user.deleted_at && (
                      <Can permission="delete_users">
                        <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700" onClick={() => handleDeleteUser(user)}>
                          {t("users_screen.delete")}
                        </button>
                      </Can>
                    )}

                    {user.deleted_at && (
                      <Can permission="update_users">
                        <button className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700" onClick={() => handleRestoreUser(user)}>
                          {t("users_screen.restore")}
                        </button>
                      </Can>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">{t("users_screen.no_results")}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / edit user modal */}
      {openEdit && currentUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{t("users_screen.modal.title")}</h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("users_screen.modal.name")}</RequiredLabel>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                />
              </div>

              <div>
                <RequiredLabel required>{t("users_screen.modal.email")}</RequiredLabel>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>

              <div>
                <RequiredLabel required>{t("users_screen.modal.phone")}</RequiredLabel>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  value={currentUser.phone || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <RequiredLabel required>{t("users_screen.modal.role")}</RequiredLabel>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  value={currentUser.role_id}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      role_id: Number(e.target.value),
                    })
                  }
                >
                  <option value="" disabled>{t("users_screen.modal.select_role")}</option>
                  <option value={1}>Admin</option>
                  <option value={2}>Partner</option>
                  <option value={3}>Client</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => setOpenEdit(false)}>
                {t("users_screen.modal.cancel")}
              </button>

              <Can permission="update_users">
                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition" onClick={handleSaveUser}>
                  {t("users_screen.modal.save")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
