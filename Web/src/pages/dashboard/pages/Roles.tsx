import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Permission } from "../../../types/permission";
import type { Roles } from "../../../types/roles";
import type { Modules } from "../../../types/modules";

interface PermissionsByRole {
  [roleId: number]: number[];
}

interface GroupedPermissions {
  [moduleId: number]: Permission[];
}

export default function RolesTable() {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Modules[]>([]);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<PermissionsByRole>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchModules();
  }, []);

  const fetchRoles = async () => {
    const res = await fetch(`${VITE_API_URL}/api/roles`);
    const data = await res.json();
    setRoles(data);
    setLoading(false);
  };

  const fetchPermissions = async () => {
    const res = await fetch(`${VITE_API_URL}/api/permissions`);
    const data = await res.json();
    setPermissions(data.permissions);
  };

  const fetchModules = async () => {
    const res = await fetch(`${VITE_API_URL}/api/modules`);
    const data = await res.json();
    setModules(data.modules);
  };

  const loadRolePermissions = async (roleId: number) => {
    const res = await fetch(`${VITE_API_URL}/api/roles/${roleId}/permissions`);
    const data = await res.json();
    setSelectedPerms((prev) => ({ ...prev, [roleId]: data.permissions }));
  };

  const toggleExpand = (roleId: number) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
      return;
    }
    setExpandedRole(roleId);
    loadRolePermissions(roleId);
  };

  const togglePermission = (roleId: number, permId: number) => {
    const current = selectedPerms[roleId] || [];
    const updated = current.includes(permId)
      ? current.filter((p) => p !== permId)
      : [...current, permId];

    setSelectedPerms((prev) => ({
      ...prev,
      [roleId]: updated,
    }));
  };

  const savePermissions = async (roleId: number) => {
    await fetch(`${VITE_API_URL}/api/roles/${roleId}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: selectedPerms[roleId] || [] }),
    });

    alert("Permisos guardados");
  };

  const grouped: GroupedPermissions = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.module_id]) acc[perm.module_id] = [];
      acc[perm.module_id].push(perm);
      return acc;
    },
    {} as GroupedPermissions
  );

  const getModuleName = (moduleId: number) => {
    return modules.find((m) => m.id === moduleId)?.name || `Módulo ${moduleId}`;
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gestión de Roles y Permisos
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading roles...</p>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                <button
                  onClick={() => toggleExpand(role.id)}
                  className="w-full flex justify-between items-center px-4 py-4 text-left font-semibold text-gray-800 text-lg rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#27B9BA]/20 text-[#27B9BA] rounded-xl flex items-center justify-center font-bold">
                      {role.name.charAt(0).toUpperCase()}
                    </div>
                    {role.name}
                  </div>

                  <span className="text-gray-600 text-xl">
                    {expandedRole === role.id ? "−" : "+"}
                  </span>
                </button>

                {expandedRole === role.id && (
                  <div className="p-6 bg-white rounded-b-xl border-t border-gray-200 animate-fadeIn">

                    <h3 className="text-xl font-medium text-gray-700 mb-6">
                      Permisos asignados a{" "}
                      <span className="font-bold text-[#27B9BA]">{role.name}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-2 pb-4 custom-scroll">
                      {Object.keys(grouped).map((moduleId) => {
                        const id = Number(moduleId);
                        return (
                          <div key={id} className="border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">
                              {getModuleName(id)}
                            </h4>

                            <div className="space-y-2">
                              {grouped[id].map((perm) => (
                                <label key={perm.id} className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedPerms[role.id]?.includes(perm.id) || false}
                                    onChange={() => togglePermission(role.id, perm.id)}
                                    className="w-5 h-5 accent-[#27B9BA]"
                                  />
                                  <span className="text-gray-700">{perm.name}</span>
                                </label>
                              ))}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end sticky bottom-0 bg-white py-4 border-t border-gray-200">
                      <button
                        onClick={() => savePermissions(role.id)}
                        className="px-6 py-2 bg-[#27B9BA] text-white rounded-xl shadow-md hover:bg-[#1da6a7] transition font-medium"
                      >
                        Save Changes
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .custom-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scroll::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 8px;
          }

          .custom-scroll::-webkit-scrollbar-thumb {
            background: #27B9BA;
            border-radius: 8px;
          }
        `}
      </style>
    </DashboardLayout>
  );
}
