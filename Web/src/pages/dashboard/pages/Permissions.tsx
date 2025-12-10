import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Modules } from "../../../types/modules";
import type { Permission } from "../../../types/permission";

export default function PermissionsTable() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [modules, setModules] = useState<Modules[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchModules();
        fetchPermissions();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/modules`);
            const data = await res.json();
            setModules(data.modules);
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/permissions`);
            const data = await res.json();
            setPermissions(data.permissions);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const getModuleName = (id: number) =>
        modules.find((m) => m.id === id)?.name || "Unknown";

    const filtered = permissions.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Permissions</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Search permission..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    Add Permission
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading permissions...</p>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Permission</th>
                                    <th className="pb-3">Module</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((perm) => (
                                    <tr
                                        key={perm.id}
                                        className="border-b hover:bg-gray-50 text-gray-700"
                                    >
                                        <td className="py-3">{perm.id}</td>
                                        <td className="py-3">{perm.name}</td>
                                        <td className="py-3">{getModuleName(perm.module_id)}</td>

                                        <td className="py-3 text-right space-x-3">
                                            <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
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
                                        <td colSpan={4} className="text-center py-6 text-gray-500">
                                            No permissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
