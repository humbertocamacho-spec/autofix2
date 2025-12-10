import { useState} from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineTicket, HiOutlineLogout, HiOutlineChevronDown, HiOutlineKey,HiOutlineDocumentDuplicate,HiOutlineEye,
  HiOutlineChevronRight, HiOutlineMenu, HiOutlineSearch, HiOutlineBell, HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineTruck, HiOutlineShieldCheck,HiOutlineIdentification
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

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setOpenMenu(null);
    navigate("/login", { replace: true });
  };

  const modulesPermissions: Record<string, string[]> = {
    dashboard: [], // siempre visible
    users: ["read_users"], // Admin
    admins: ["read_admins"], // Admin
    partners: ["read_partners"], // Admin
    clients: ["read_clients"], // Admin
    specialities: ["read_specialities"], // Admin
    certifications: ["read_certifications"], // Admin
    brands: ["read_brands"], // Admin
    tickets: ["read_tickets", "read_pending_tickets"], // Partner y Cliente
    myCars: ["read_cars_clients"], // Cliente
    roles: ["read_roles"],
    modules: ["read_modules"],// Admin
    permissions: ["read_permissions"],// Admin
  };

  const CheckPermissionForModule = (module: string) => {
    const requiredPermissions = modulesPermissions[module] || [];
    if (requiredPermissions.length === 0) return true;
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

  return (
    <div key={layoutKey} className="flex min-h-screen bg-gray-50">
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
          {CheckPermissionForModule("dashboard") && (
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              <HiOutlineHome size={iconSize} />
              <span className={textClass()}>Dashboard</span>
              {!sidebarOpen && <Tooltip>Dashboard</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("users") && (
            <Link to="/dashboard/users" className={linkClass("/dashboard/users")}>
              <HiOutlineUser size={iconSize} />
              <span className={textClass()}>Users</span>
              {!sidebarOpen && <Tooltip>Users</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("admins") && (
            <Link to="/dashboard/admins" className={linkClass("/dashboard/admins")}>
              <HiOutlineIdentification size={iconSize} />
              <span className={textClass()}>Admins</span>
              {!sidebarOpen && <Tooltip>Admins</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("partners") && (
            <Link to="/dashboard/partners" className={linkClass("/dashboard/partners")}>
              <HiOutlineUsers size={iconSize} />
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

          {CheckPermissionForModule("roles") && (
            <Link to="/dashboard/roles" className={linkClass("/dashboard/roles")}>
              <HiOutlineEye size={iconSize} />
              <span className={textClass()}>Roles y Permisos</span>
              {!sidebarOpen && <Tooltip>Roles y Permisos</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("specialities") && (
            <Link to="/dashboard/specialities" className={linkClass("/dashboard/specialities")}>
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
            <Link to="/dashboard/certifications" className={linkClass("/dashboard/certifications")}>
              <HiOutlineShieldCheck size={iconSize} />
              <span className={textClass()}>Certifications</span>
              {!sidebarOpen && <Tooltip>Certifications</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("tickets") && (
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
                  <Link to="/tickets/list" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">
                    Pendientes
                  </Link>
                  <Link to="/tickets/create" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">
                    Confirmados
                  </Link>
                </div>
              )}
            </div>
          )}

          {CheckPermissionForModule("myCars") && (
            <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
              <HiOutlineTruck size={iconSize} />
              <span className={textClass()}>My Cars</span>
              {!sidebarOpen && <Tooltip>My Cars</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("modules") && (
            <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
              <HiOutlineDocumentDuplicate size={iconSize} />
              <span className={textClass()}>Modules</span>
              {!sidebarOpen && <Tooltip>Modules</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("permissions") && (
            <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
              <HiOutlineKey size={iconSize} />
              <span className={textClass()}>Permissions</span>
              {!sidebarOpen && <Tooltip>Permissions</Tooltip>}
            </Link>
          )}
        </nav>

        <div className="border-t border-gray-200 px-3 pt-5 pb-6">
          <button onClick={handleLogout} className="w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 text-red-600 transition hover:bg-red-50">
            <HiOutlineLogout size={iconSize} className="shrink-0" />
            <span className={textClass()}>Logout</span>
            {!sidebarOpen && <Tooltip>Logout</Tooltip>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 overflow-y-auto max-h-screen ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <HiOutlineMenu size={26} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            {roleBadge()}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
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
              <img src="https://i.pravatar.cc/40" alt="User avatar" className="size-10 cursor-pointer rounded-full ring-2 ring-gray-200"/>
              {sidebarOpen && (
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}

const Tooltip = ({ children }: { children: string }) => (
  <span className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-50">
    {children}
  </span>
);
