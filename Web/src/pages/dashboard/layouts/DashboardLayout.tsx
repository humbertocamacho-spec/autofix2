import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {  HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineLogout, } from "react-icons/hi";
import { useAuthContext } from "../../../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const { user } = useAuthContext();   // ⬅️ USAR AUTH
  const can = (perm: string) => user?.permissions?.includes(perm); // ⬅️ PERMISOS

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);
  const iconSize = sidebarOpen ? 23 : 28;

  // Si no hay usuario → no renderiza (previene pantallas blancas)
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${ sidebarOpen ? "w-64" : "w-20"}`}>
        
        {/* LOGO */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <h1 className={`font-bold text-2xl text-[#27B9BA] transition-all duration-300 whitespace-nowrap ${ sidebarOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>AutoFix.</h1>
          <div className="size-11 rounded-xl bg-[#27B9BA] flex items-center justify-center text-white font-bold text-xl shrink-0"> A </div>
        </div>

        {/* MENÚ */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">

          <Link to="/dashboard" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${
            isActive("/dashboard") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"
          }`}>
            <HiOutlineHome size={iconSize} />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
          </Link>

          {/* SOLO USUARIOS CON PERMISO ver_partners */}
          {can("ver_partners") && (
            <Link to="/dashboard/partners" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${
              isActive("/dashboard/partners") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"
            }`}>
              <HiOutlineUsers size={iconSize} />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>Partners</span>
            </Link>
          )}

          {/* SOLO SI TIENE PERMISO ver_clientes */}
          {can("ver_clientes") && (
            <Link to="/clients" className={`group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${
              isActive("/clients") ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"
            }`}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>Clients</span>
            </Link>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-gray-200 px-3 pt-5 pb-6">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-red-600 hover:bg-red-50"
          >
            <HiOutlineLogout size={iconSize} />
            <span className={`${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </header>
        <main className="min-h-full bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}
