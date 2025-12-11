import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    role_id: number;
    photo_url: string | null;
    gender_id: number | null;
    role_name?: string;
    gender_name?: string;
}

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

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/users`);
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (user: User) => {
        setCurrentUser(user);
        setOpenEdit(true);
    };

    const handleUpdateUser = async () => {
        if (!currentUser) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/users/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentUser),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error updating user");
                return;
            }

            alert("Usuario actualizado correctamente");
            setOpenEdit(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">{t("users_screen.title")}</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder={t("users_screen.search_placeholder")}
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    {t("users_screen.add_button")}
                </button>
            </div>

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
                                <th className="pb-3">{t("users_screen.table.gender")}</th>
                                <th className="pb-3 text-right">{t("users_screen.table.actions")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 text-gray-700"
                                >
                                    <td className="py-3">{user.id}</td>
                                    <td className="py-3">{user.name}</td>
                                    <td className="py-3">{user.email}</td>
                                    <td className="py-3">{user.phone || "—"}</td>
                                    <td className="py-3">{user.role_name || "—"}</td>
                                    <td className="py-3">{user.gender_name || "—"}</td>

                                    <td className="py-3 text-right space-x-3">
                                        <button
                                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                                            onClick={() => handleOpenEdit(user)}
                                        >
                                            {t("users_screen.edit")}
                                        </button>

                                        <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                                            {t("users_screen.delete")}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-500">
                                        {t("users_screen.no_results")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {openEdit && currentUser && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            {t("users_screen.modal.title")}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">
                                    {t("users_screen.modal.name")}
                                </label>
                                <input
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                                    value={currentUser.name}
                                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">
                                    {t("users_screen.modal.email")}
                                </label>
                                <input
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                                    value={currentUser.email}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">
                                    {t("users_screen.modal.phone")}
                                </label>
                                <input
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                                    value={currentUser.phone || ""}
                                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">
                                    {t("users_screen.modal.role")}
                                </label>
                                <select
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                                    value={currentUser.role_id}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, role_id: Number(e.target.value) })
                                    }
                                >
                                    <option value="" disabled>
                                        {t("users_screen.modal.select_role")}
                                    </option>
                                    <option value={1}>Admin</option>
                                    <option value={2}>Partner</option>
                                    <option value={3}>Client</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">
                                    {t("users_screen.modal.gender")}
                                </label>
                                <select
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                                    value={currentUser.gender_id || ""}
                                    onChange={(e) =>
                                        setCurrentUser({ ...currentUser, gender_id: Number(e.target.value) })
                                    }
                                >
                                    <option value="">
                                        {t("users_screen.modal.select_gender")}
                                    </option>
                                    <option value={1}>Femenino</option>
                                    <option value={2}>Masculino</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setOpenEdit(false)}
                            >
                                {t("users_screen.modal.cancel")}
                            </button>

                            <button
                                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
                                onClick={handleUpdateUser}
                            >
                                {t("users_screen.modal.save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
