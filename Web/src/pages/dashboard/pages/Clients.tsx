import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Client } from "../../../types/client";
import type { User } from "../../../types/users";
import { useTranslation } from "react-i18next";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  const [userId, setUserId] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/client`);
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
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

    if (!userId) {
      newErrors.userId = "Este campo es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const openCreate = () => {
    setIsEditing(false);
    setCurrentClient(null);
    setUserId(null);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const openEdit = (client: Client) => {
    setIsEditing(true);
    setCurrentClient(client);
    setUserId(client.user_id);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  const saveClient = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${VITE_API_URL}/api/client/${currentClient?.id}`
      : `${VITE_API_URL}/api/client`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    setOpenModal(false);
    fetchClients();
  };

  const deleteClient = async (id: number) => {
    if (!confirm("¿Eliminar cliente?")) return;

    await fetch(`${VITE_API_URL}/api/client/${id}`, {
      method: "DELETE",
    });

    fetchClients();
  };

  const filtered = clients.filter((c) =>
    c.user_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("clients_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("clients_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_clients">
          <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
            {t("clients_screen.add_button")}
          </button>
        </Can>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("clients_screen.loading")}</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-3">{t("clients_screen.table.id")}</th>
                <th className="pb-3">{t("clients_screen.table.name")}</th>
                <th className="pb-3 text-right">{t("clients_screen.table.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="py-3">{item.id}</td>
                  <td className="py-3">{item.user_name}</td>
                  <td className="py-3 text-right space-x-3">

                    <Can permission="update_clients">
                      <button onClick={() => openEdit(item)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                        {t("clients_screen.edit")}
                      </button>
                    </Can>

                    <Can permission="delete_clients">
                      <button onClick={() => deleteClient(item.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        {t("clients_screen.delete")}
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">{t("clients_screen.no_results")}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[450px] p-6 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("clients_screen.edit_title") : t("clients_screen.create_title")}
            </h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("clients_screen.choose_user")}</RequiredLabel>
                <select
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.userId ? "border-red-500" : "border-gray-300"}  bg-white focus:ring-2 focus:ring-[#27B9BA]`}
                  value={userId || ""}
                  onChange={(e) => { setUserId(Number(e.target.value)); setErrors((prev) => ({ ...prev, userId: "" })); }}
                >
                  <option value="">{t("clients_screen.choose_user")}</option>

                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {submitted && errors.userId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.userId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("clients_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_clients" : "create_clients"}>
                <button onClick={saveClient} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("clients_screen.save") : t("clients_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
