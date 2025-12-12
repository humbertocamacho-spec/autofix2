import { useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineTicket, HiOutlineLogout, HiOutlineChevronDown, HiOutlineKey,HiOutlineDocumentDuplicate,
  HiOutlineEye,HiOutlineTranslate,HiOutlineChevronRight, HiOutlineMenu, HiOutlineSearch, HiOutlineBell, HiOutlineUserGroup, HiOutlineBriefcase, HiOutlineTruck, 
  HiOutlineShieldCheck,HiOutlineIdentification,HiOutlineThumbUp
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { Props } from "../../../types/props";

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuthContext();
  const layoutKey = user?.id ? `user-${user.id}` : "guest";

  const iconSize = sidebarOpen ? 23 : 28;
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

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
    partner_certifications: ["read_partner_certifications"], // Admin
    clients: ["read_clients"], // Admin
    specialities: ["read_specialities"], // Admin
    certifications: ["read_certifications"], // Admin
    brands: ["read_brands"], // Admin
    roles: ["read_roles"], // Admin
    modules: ["read_modules"], // Admin
    permissions: ["read_permissions"], // Admin
    tickets: ["read_tickets", "read_pending_tickets"], // Partner y Cliente
    myCars: ["read_cars_clients"], // Cliente
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
          {t("dashboard_layout.admin")}
        </span>
      );
    if (user?.role_id === 2)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
          {t("dashboard_layout.partner")}
        </span>
      );
    if (user?.role_id === 3)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
          {t("dashboard_layout.client")}
        </span>
      );
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-lg">Loading...</span>
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
              <span className={textClass()}>{t("dashboard")}</span>
              {!sidebarOpen && <Tooltip>{t("dashboard")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("users") && (
            <Link to="/dashboard/users" className={linkClass("/dashboard/users")}>
              <HiOutlineUser size={iconSize} />
              <span className={textClass()}>{t("users")}</span>
              {!sidebarOpen && <Tooltip>{t("users")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("admins") && (
            <Link to="/dashboard/admins" className={linkClass("/dashboard/admins")}>
              <HiOutlineIdentification size={iconSize} />
              <span className={textClass()}>{t("admins")}</span>
              {!sidebarOpen && <Tooltip>{t("admins")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("partners") && (
            <Link to="/dashboard/partners" className={linkClass("/dashboard/partners")}>
              <HiOutlineUsers size={iconSize} />
              <span className={textClass()}>{t("partners")}</span>
              {!sidebarOpen && <Tooltip>{t("partners")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("partner_certifications") && (
            <Link to="/dashboard/partner_certifications" className={linkClass("/dashboard/partner_certifications")}>
              <HiOutlineThumbUp size={iconSize} />
              <span className={textClass()}>{t("partner_certifications")}</span>
              {!sidebarOpen && <Tooltip>{t("partner_certifications")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("clients") && (
            <Link to="/dashboard/clients" className={linkClass("/dashboard/clients")}>
              <HiOutlineUserGroup size={iconSize} />
              <span className={textClass()}>{t("clients")}</span>
              {!sidebarOpen && <Tooltip>{t("clients")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("roles") && (
            <Link to="/dashboard/roles" className={linkClass("/dashboard/roles")}>
              <HiOutlineEye size={iconSize} />
              <span className={textClass()}>{t("roles")}</span>
              {!sidebarOpen && <Tooltip>{t("roles")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("specialities") && (
            <Link to="/dashboard/specialities" className={linkClass("/dashboard/specialities")}>
              <HiOutlineBriefcase size={iconSize} />
              <span className={textClass()}>{t("specialities")}</span>
              {!sidebarOpen && <Tooltip>{t("specialities")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("brands") && (
            <Link to="/dashboard/brands" className={linkClass("/dashboard/brands")}>
              <HiOutlineTruck size={iconSize} />
              <span className={textClass()}>{t("brands")}</span>
              {!sidebarOpen && <Tooltip>{t("brands")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("certifications") && (
            <Link to="/dashboard/certifications" className={linkClass("/dashboard/certifications")}>
              <HiOutlineShieldCheck size={iconSize} />
              <span className={textClass()}>{t("certifications")}</span>
              {!sidebarOpen && <Tooltip>{t("certifications")}</Tooltip>}
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
                <span className={textClass()}>{t("tickets")}</span>
                {sidebarOpen && (
                  <span className="ml-auto">
                    {openMenu === "tickets" ? (
                      <HiOutlineChevronDown size={18} />
                    ) : (
                      <HiOutlineChevronRight size={18} />
                    )}
                  </span>
                )}
                {!sidebarOpen && <Tooltip>{t("tickets")}</Tooltip>}
              </button>

              {sidebarOpen && openMenu === "tickets" && (
                <div className="mt-2 space-y-1 pl-10">
                  <Link to="/tickets/list" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">
                    Pendientes
                  </Link>
                  <Link to="/tickets/created" className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA] transition">
                    Confirmados
                  </Link>
                </div>
              )}
            </div>
          )}

          {CheckPermissionForModule("myCars") && (
            <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
              <HiOutlineTruck size={iconSize} />
              <span className={textClass()}>{t("myCars")}</span>
              {!sidebarOpen && <Tooltip>{t("myCars")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("modules") && (
            <Link to="/dashboard/modules" className={linkClass("/dashboard/modules")}>
              <HiOutlineDocumentDuplicate size={iconSize} />
              <span className={textClass()}>{t("modules")}</span>
              {!sidebarOpen && <Tooltip>{t("modules")}</Tooltip>}
            </Link>
          )}

          {CheckPermissionForModule("permissions") && (
            <Link to="/dashboard/permissions" className={linkClass("/dashboard/permissions")}>
              <HiOutlineKey size={iconSize} />
              <span className={textClass()}>{t("permissions")}</span>
              {!sidebarOpen && <Tooltip>{t("permissions")}</Tooltip>}
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
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <HiOutlineMenu size={26} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              {t("dashboard")}
            </h2>

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
                placeholder={t("search")}
                className="w-64 rounded-xl bg-gray-100 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#27B9BA] transition"
              />
            </div>

            <div className="relative inline-block">
              <HiOutlineTranslate
                size={20}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="pl-8 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 focus:ring-[#27B9BA] focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
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
