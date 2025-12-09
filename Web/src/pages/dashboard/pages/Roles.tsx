import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { API_URL } from "../../../config/env";

export interface Role {
  id: number;
  name: string;
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Roles</h1>

      {/* Search + Add */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search role..."
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 
                     focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
          Add Role
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-3">ID</th>
                <th className="pb-3">Name</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="py-3">{role.id}</td>
                  <td className="py-3">{role.name}</td>

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
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
