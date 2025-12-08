import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineClipboardList,
  HiOutlineCollection, HiOutlineUserGroup, HiOutlineCog,
  HiOutlineLogout, HiOutlineChevronDown, HiOutlineChevronRight,
  HiOutlineMenu, HiOutlineSearch, HiOutlineBell
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

  const roleFlags = useMemo(() => ({
    isAdmin: user?.role_id === 1,
    isPartner: user?.role_id === 2,
    isClient: user?.role_id === 3
  }), [user]);

  const toggleMenu = (menu: string) => setOpenMenu(openMenu === menu ? null : menu);
  const isActive = (path: string) => location.pathname.startsWith(path);
  const iconSize = sidebarOpen ? 23 : 28;

  const handleLogout = () => {
    logout();
    setOpenMenu(null);
    navigate("/login", { replace: true });
  };

  const roleBadge = () => {
    if (roleFlags.isAdmin) return <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">Admin</span>;
    if (roleFlags.isPartner) return <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">Partner</span>;
    if (roleFlags.isClient) return <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">Cliente</span>;
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-lg">Cargando...</span>
      </div>
    );
  }

  return (
    <div key={layoutKey} className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <h1 className={`font-bold text-2xl text-[#27B9BA] transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
            AutoFix.
          </h1>
          <div className="size-11 rounded-xl bg-[#27B9BA] flex items-center justify-center text-white font-bold text-xl shrink-0">A</div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          <Link to="/dashboard" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/dashboard") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
            <HiOutlineHome size={iconSize} />
            <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
            {!sidebarOpen && <Tooltip>Dashboard</Tooltip>}
          </Link>

          {(roleFlags.isAdmin || roleFlags.isPartner) && (
            <Link to="/dashboard/partners" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/dashboard/partners") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineUsers size={iconSize} />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Partners</span>
              {!sidebarOpen && <Tooltip>Partners</Tooltip>}
            </Link>
          )}

          {roleFlags.isAdmin && (
            <div>
              <button onClick={() => toggleMenu("projects")} className={`w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${openMenu === "projects" || isActive("/projects") ? "bg-[#27B9BA]/10 text-[#27B9BA] font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
                <HiOutlineClipboardList size={iconSize} />
                <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Projects</span>
                {sidebarOpen && (
                  <span className="ml-auto">{openMenu === "projects" ? <HiOutlineChevronDown size={18} /> : <HiOutlineChevronRight size={18} />}</span>
                )}
                {!sidebarOpen && <Tooltip>Projects</Tooltip>}
              </button>
              {sidebarOpen && openMenu === "projects" && (
                <div className="mt-2 space-y-1 pl-10">
                  <Link to="/projects/list" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">Project List</Link>
                  <Link to="/projects/create" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">Create Project</Link>
                </div>
              )}
            </div>
          )}

          {(roleFlags.isAdmin || roleFlags.isClient) && (
            <Link to="/clients" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${isActive("/clients") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Clients</span>
              {!sidebarOpen && <Tooltip>Clients</Tooltip>}
            </Link>
          )}

          {(roleFlags.isAdmin || roleFlags.isPartner) && (
            <div>
              <button onClick={() => toggleMenu("apps")} className={`w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${openMenu === "apps" ? "bg-[#27B9BA]/10 text-[#27B9BA] font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
                <HiOutlineCollection size={iconSize} />
                <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Apps</span>
                {sidebarOpen && (
                  <span className="ml-auto">{openMenu === "apps" ? <HiOutlineChevronDown size={18} /> : <HiOutlineChevronRight size={18} />}</span>
                )}
                {!sidebarOpen && <Tooltip>Apps</Tooltip>}
              </button>
              {sidebarOpen && openMenu === "apps" && (
                <div className="mt-2 space-y-1 pl-10">
                  <Link to="/calendar" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA]">Calendar</Link>
                  <Link to="/todo" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA]">To-Do</Link>
                  <Link to="/email" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA]">Email</Link>
                </div>
              )}
            </div>
          )}

          {roleFlags.isAdmin && (
            <Link to="/settings" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all mt-6 ${isActive("/settings") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`}>
              <HiOutlineCog size={iconSize} />
              <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Settings</span>
              {!sidebarOpen && <Tooltip>Settings</Tooltip>}
            </Link>
          )}
        </nav>

        <div className="border-t border-gray-200 px-3 pt-5 pb-6">
          <button onClick={handleLogout} className="w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 text-red-600 transition hover:bg-red-50">
            <HiOutlineLogout size={iconSize} className="shrink-0" />
            <span className={`font-medium ${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
            {!sidebarOpen && <Tooltip>Logout</Tooltip>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
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
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search..." className="w-64 rounded-xl bg-gray-100 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#27B9BA] transition" />
            </div>
            <button className="relative rounded-xl p-2 text-gray-600 transition hover:bg-gray-100">
              <HiOutlineBell size={22} />
              <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/40" alt="User avatar" className="size-10 cursor-pointer rounded-full ring-2 ring-gray-200" />
              {sidebarOpen && <span className="text-sm font-medium text-gray-700">{user?.name || user?.email}</span>}
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
