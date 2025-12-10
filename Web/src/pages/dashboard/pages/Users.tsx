import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";

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
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    Add User
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading users...</p>
                ) : (
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr className="text-gray-600 border-b">
                                <th className="pb-3">ID</th>
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Phone</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3">Gender</th>
                                <th className="pb-3 text-right">Actions</th>
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
                                            Edit
                                        </button>


                                        <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {openEdit && currentUser && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[450px] rounded-xl p-6 shadow-2xl border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>

                        <div className="space-y-3">
                            <input
                                className="w-full border px-3 py-2 rounded"
                                value={currentUser.name}
                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                placeholder="Name"
                            />

                            <input
                                className="w-full border px-3 py-2 rounded"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                placeholder="Email"
                            />

                            <input
                                className="w-full border px-3 py-2 rounded"
                                value={currentUser.phone || ""}
                                onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                placeholder="Phone"
                            />

                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={currentUser.role_id}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, role_id: Number(e.target.value) })
                                }
                            >
                                <option value="" disabled>Select role</option>
                                <option value={1}>Admin</option>
                                <option value={2}>Partner</option>
                                <option value={3}>Client</option>
                            </select>

                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={currentUser.gender_id || ""}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, gender_id: Number(e.target.value) })
                                }
                            >
                                <option value="">Gender</option>
                                <option value={1}>Femenino</option>
                                <option value={2}>Masculino</option>
                            </select>

                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                onClick={() => setOpenEdit(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg"
                                onClick={handleUpdateUser}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}
