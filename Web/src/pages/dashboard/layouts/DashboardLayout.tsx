import { useState} from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import {
  HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineTicket, HiOutlineCog,
  HiOutlineLogout, HiOutlineChevronDown, HiOutlineChevronRight,
  HiOutlineMenu, HiOutlineSearch, HiOutlineBell, HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineTruck, HiOutlineShieldCheck
} from "react-icons/hi";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuthContext();
  const layoutKey = user?.id ? `user-${user.id}` : "guest";

  const iconSize = sidebarOpen ? 23 : 28;

  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setOpenMenu(null);
    navigate("/login", { replace: true });
  };

  // ========================================
  // Define módulos y sus permisos mínimos
  // ========================================
  const modulesPermissions: Record<string, string[]> = {
    dashboard: [], // siempre visible
    users: ["read_1"], // Admin
    admins: ["read_11"], // Admin
    partners: ["read_2"], // Admin
    clients: ["read_6"], // Admin
    specialities: ["read_3"], // Admin
    certifications: ["read_4"], // Admin
    brands: ["read_8"], // Admin
    tickets: ["read_9", "read_10"], // Partner y Cliente
    myCars: ["read_7"], // Cliente
    settings: ["read_12"], // Admin
  };

  // ========================================
  // Función para revisar permisos
  // ========================================
  const CheckPermissionForModule = (module: string) => {
    const requiredPermissions = modulesPermissions[module] || [];
    if (requiredPermissions.length === 0) return true; // Dashboard siempre visible
    return requiredPermissions.some((p) => user?.permissions?.includes(p));
  };

  const roleBadge = () => {
    if (user?.role_id === 1)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">
          Admin
        </span>
      );
    if (user?.role_id === 2)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
          Partner
        </span>
      );
    if (user?.role_id === 3)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
          Cliente
        </span>
      );
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-lg">Cargando...</span>
      </div>
    );
  }

  // ========================================
  // Helpers para clases de links y textos
  // ========================================
  function linkClass(path: string) {
    return `group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${
      isActive(path)
        ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  }

  function textClass() {
    return `font-medium ${sidebarOpen ? "block" : "hidden"}`;
  }

  function menuButtonClass() {
    return `w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all text-gray-700 hover:bg-gray-100`;
  }

  // ========================================
  // Render
  // ========================================
  return (
    <div key={layoutKey} className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <h1
            className={`font-bold text-2xl text-[#27B9BA] transition-all duration-300 whitespace-nowrap ${
              sidebarOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            AutoFix.
          </h1>
          <div className="size-11 rounded-xl bg-[#27B9BA] flex items-center justify-center text-white font-bold text-xl shrink-0">
            A
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {/* Dashboard siempre visible */}
          {CheckPermissionForModule("dashboard") && (
            <Link
              to="/dashboard"
              className={linkClass("/dashboard")}
            >
              <HiOutlineHome size={iconSize} />
              <span className={textClass()}>Dashboard</span>
              {!sidebarOpen && <Tooltip>Dashboard</Tooltip>}
            </Link>
          )}

          {/* Admin Módulos */}
          {CheckPermissionForModule("users") && (
            <Link to="/dashboard/users" className={linkClass("/dashboard/users")}>
              <HiOutlineUser size={iconSize} />
              <span className={textClass()}>Users</span>
              {!sidebarOpen && <Tooltip>Users</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("admins") && (
            <Link to="/dashboard/admins" className={linkClass("/dashboard/admins")}>
              <HiOutlineUsers size={iconSize} />
              <span className={textClass()}>Admins</span>
              {!sidebarOpen && <Tooltip>Admins</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("partners") && (
            <Link to="/dashboard/partners" className={linkClass("/dashboard/partners")}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={textClass()}>Partners</span>
              {!sidebarOpen && <Tooltip>Partners</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("clients") && (
            <Link to="/dashboard/clients" className={linkClass("/dashboard/clients")}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={textClass()}>Clients</span>
              {!sidebarOpen && <Tooltip>Clients</Tooltip>}
            </Link>
          )}


          {roleFlags.isAdmin && (
            <Link to="/dashboard/roles" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/dashboard/roles") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Roles</span>
              {!sidebarOpen && <Tooltip>Roles</Tooltip>}
            </Link>
          )}

          {roleFlags.isAdmin && (
            <Link to="/dashboard/partners" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/dashboard/partners") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineBriefcase size={iconSize} />
              <span className={textClass()}>Specialities</span>
              {!sidebarOpen && <Tooltip>Specialities</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("brands") && (
            <Link to="/dashboard/brands" className={linkClass("/dashboard/brands")}>
              <HiOutlineTruck size={iconSize} />
              <span className={textClass()}>Brands</span>
              {!sidebarOpen && <Tooltip>Brands</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("certifications") && (
            <Link
              to="/dashboard/certifications"
              className={linkClass("/dashboard/certifications")}
            >
              <HiOutlineShieldCheck size={iconSize} />
              <span className={textClass()}>Certifications</span>
              {!sidebarOpen && <Tooltip>Certifications</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("settings") && (
            <Link to="/settings" className={`${linkClass("/settings")} mt-6`}>
              <HiOutlineCog size={iconSize} />
              <span className={textClass()}>Settings</span>
              {!sidebarOpen && <Tooltip>Settings</Tooltip>}
            </Link>
          )}

          {roleFlags.isPartner && (
            <Link to="/dashboard/partners" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/dashboard/partners") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineTicket size={iconSize} />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Tickets</span>
              {!sidebarOpen && <Tooltip>Tickets</Tooltip>}
            </Link>
          )}

          {roleFlags.isClient && (
            <div>
              <button
                onClick={() => toggleMenu("tickets")}
                className={`${menuButtonClass()} ${
                  openMenu === "tickets" || isActive("/tickets")
                    ? "bg-[#27B9BA]/10 text-[#27B9BA] font-semibold"
                    : ""
                }`}
              >
                <HiOutlineTicket size={iconSize} />
                <span className={textClass()}>Tickets</span>
                {sidebarOpen && (
                  <span className="ml-auto">
                    {openMenu === "tickets" ? (
                      <HiOutlineChevronDown size={18} />
                    ) : (
                      <HiOutlineChevronRight size={18} />
                    )}
                  </span>
                )}
                {!sidebarOpen && <Tooltip>Tickets</Tooltip>}
              </button>

              {sidebarOpen && openMenu === "tickets" && (
                <div className="mt-2 space-y-1 pl-10">
                  <Link
                    to="/tickets/list"
                    className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition"
                  >
                    Pendientes
                  </Link>
                  <Link
                    to="/tickets/create"
                    className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition"
                  >
                    Confirmados
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* My Cars para clientes */}
          {CheckPermissionForModule("myCars") && (
            <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
              <HiOutlineTruck size={iconSize} />
              <span className={textClass()}>My Cars</span>
              {!sidebarOpen && <Tooltip>My Cars</Tooltip>}
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 px-3 pt-5 pb-6">
          <button
            onClick={handleLogout}
            className="w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 text-red-600 transition hover:bg-red-50"
          >
            <HiOutlineLogout size={iconSize} className="shrink-0" />
            <span className={textClass()}>Logout</span>
            {!sidebarOpen && <Tooltip>Logout</Tooltip>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <HiOutlineMenu size={26} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            {roleBadge()}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-xl bg-gray-100 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#27B9BA] transition"
              />
            </div>
            <button className="relative rounded-xl p-2 text-gray-600 transition hover:bg-gray-100">
              <HiOutlineBell size={22} />
              <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40"
                alt="User avatar"
                className="size-10 cursor-pointer rounded-full ring-2 ring-gray-200"
              />
              {sidebarOpen && (
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-full bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}

const Tooltip = ({ children }: { children: string }) => (
  <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
    {children}
  </span>
);
