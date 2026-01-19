import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineTicket, HiOutlineLogout, HiOutlineChevronDown, HiOutlineKey,HiOutlineDocumentDuplicate,
  HiOutlineEye,HiOutlineTranslate,HiOutlineChevronRight, HiOutlineMenu, HiOutlineUserGroup, HiOutlineBriefcase, 
  HiOutlineShieldCheck,HiOutlineIdentification,HiOutlineThumbUp
} from "react-icons/hi";
import { IoCarOutline } from "react-icons/io5";
import { TbBrandVolkswagen } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import type { Props } from "../../../types/props";
import { ROLES } from "../../../constants/roles";

export default function DashboardLayout({ children }: Props) {
  // Sidebar state persisted in localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuthContext();
  // Layout key forces rerender when user changes
  const layoutKey = user?.id ? `user-${user.id}` : "guest";
  // Role helpers
  const isPartner = user?.role_name === ROLES.PARTNER;
  const isAdmin = user?.role_name === ROLES.ADMIN;
  const iconSize = sidebarOpen ? 22 : 20;
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [floatingMenu, setFloatingMenu] = useState<string | null>(null);

  // i18n handling
  const { t , i18n } = useTranslation();
  const [userLanguage, setUserLanguage] = useState(() => {
    const savedLang = user?.id ? localStorage.getItem(`lang_user_${user.id}`) : null;
    return savedLang || i18n.language || "es";
  });
  const changeLanguage = (lang: string) => {
    setUserLanguage(lang);
    i18n.changeLanguage(lang);
    if (user?.id) {
      localStorage.setItem(`lang_user_${user.id}`, lang);
    }
  };

  // Load user language preference
  useEffect(() => {
    if (i18n.language !== userLanguage) {
      i18n.changeLanguage(userLanguage);
    }
  }, [userLanguage, i18n]);

  // Persist user language
  useEffect(() => {
    if (user?.id) { i18n.changeLanguage(userLanguage); localStorage.setItem(`lang_user_${user.id}`, userLanguage);}
  }, [userLanguage, user?.id]);

  // Persist sidebar state
  useEffect(() => { localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);

  const isActive = (path: string) => location.pathname === path;

  // Logout handler
  const handleLogout = () => {
    logout();
    setOpenMenu(null);
    navigate("/login", { replace: true });
  };

  // Permissions map per module
  const modulesPermissions: Record<string, string[]> = {
    dashboard: [],
    users: ["read_users"],
    admins: ["read_admins"],
    partners: ["read_partners"],
    partner_certifications: ["read_partner_certifications"],
    clients: ["read_clients"],
    specialities: ["read_specialities"],
    certifications: ["read_certifications"],
    brands: ["read_brands"],
    roles: ["read_roles"],
    modules: ["read_modules"],
    permissions: ["read_permissions"],
    tickets: ["read_tickets", "read_pending_tickets"],
    myCars: ["read_cars_clients"], 
  };

  // Permission check for menu rendering
  const CheckPermissionForModule = (module: string) => {
    const requiredPermissions = modulesPermissions[module] || [];
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.some((p) => user?.permissions?.includes(p));
  };

  // Role badge renderer
  const roleBadge = () => {
    if (user?.role_name === ROLES.ADMIN)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">
          {t("dashboard_layout.admin")}
        </span>
      );
    if (user?.role_name === ROLES.PARTNER)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
          {t("dashboard_layout.partner")}
        </span>
      );
    if (user?.role_name === ROLES.CLIENT)
      return (
        <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
          {t("dashboard_layout.client")}
        </span>
      );
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500 text-lg">t{t("dashboard_layout.loading")}</span>
      </div>
    );
  }

  // Shared class helpers
  function linkClass(path: string) {
    return `group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 transition-all ${
      isActive(path) ? "bg-[#27B9BA] text-white shadow-lg shadow-[#27B9BA]/30" : "text-gray-700 hover:bg-gray-100"}`;
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
        } ${!sidebarOpen ? "overflow-x-visible" : "overflow-y-auto"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <h1 className={`font-bold text-2xl text-[#27B9BA] transition-all duration-300 whitespace-nowrap ${ sidebarOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
            AutoFix.
          </h1>
          <div className="size-11 rounded-xl bg-[#27B9BA] flex items-center justify-center text-white font-bold text-xl shrink-0">
            A
          </div>
        </div>

        <div className={`flex-1 ${sidebarOpen ? "overflow-y-auto" : ""}`}>
          <nav className="space-y-4 px-3 py-6">
            {CheckPermissionForModule("dashboard") && (
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                <HiOutlineHome size={iconSize} className="shrink-0" />
                <span className={textClass()}>{t("dashboard")}</span>
                {!sidebarOpen && <Tooltip>{t("dashboard")}</Tooltip>}
              </Link>
            )}

            <div>
              <SectionTitle show={sidebarOpen} title={t("dashboard_layout.operations")} />

              {CheckPermissionForModule("tickets") && (
                <div className="relative">
                  <button
                    onClick={() => {
                      if (isPartner) { navigate("/tickets/created"); return;}

                      if (sidebarOpen) { toggleMenu("tickets");
                      } else {
                        setFloatingMenu( floatingMenu === "tickets" ? null : "tickets");
                      }
                    }}
                    className={`${menuButtonClass()} ${ openMenu === "tickets" || floatingMenu === "tickets" ? "bg-[#27B9BA]/10 text-[#27B9BA]" : ""}`}>
                    <HiOutlineTicket size={iconSize} />
                    <span className={textClass()}>{t("tickets")}</span>

                    {!isPartner && sidebarOpen && ( <span className="ml-auto"> {openMenu === "tickets" ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}</span>)}

                    {!sidebarOpen && <Tooltip>{t("tickets")}</Tooltip>}
                  </button>

                  {!isPartner && !sidebarOpen && floatingMenu === "tickets" && (
                    <div className="absolute left-20 z-50 w-44 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                      <SubLink to="/tickets/list" active={isActive("/tickets/list")} onClick={() => setFloatingMenu(null)}>
                        {t("dashboard_layout.pending")}
                      </SubLink>

                      <SubLink to="/tickets/created" active={isActive("/tickets/created")} onClick={() => setFloatingMenu(null)}>
                        {t("dashboard_layout.confirmed")}
                      </SubLink>
                    </div>
                  )}

                  {!isPartner && sidebarOpen && openMenu === "tickets" && (
                    <div className="mt-2 space-y-1 pl-10">
                      <SubLink to="/tickets/list" active={isActive("/tickets/list")}> {t("dashboard_layout.pending")} </SubLink>
                      <SubLink to="/tickets/created" active={isActive("/tickets/created")}> {t("dashboard_layout.confirmed")}</SubLink>
                    </div>
                  )}
                </div>
              )}

              {CheckPermissionForModule("myCars") && (
                <Link to="/dashboard/my-cars" className={linkClass("/dashboard/my-cars")}>
                  <IoCarOutline size={iconSize} />
                  <span className={textClass()}>{t("myCars")}</span>
                  {!sidebarOpen && <Tooltip>{t("myCars")}</Tooltip>}
                </Link>
              )}
            </div>

            <div>
              {(isAdmin || isPartner) && (
                <SectionTitle show={sidebarOpen} title={t("dashboard_layout.users")}/>
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

              {CheckPermissionForModule("clients") && (
                <Link to="/dashboard/clients" className={linkClass("/dashboard/clients")}>
                  <HiOutlineUserGroup size={iconSize} />
                  <span className={textClass()}>{t("clients")}</span>
                  {!sidebarOpen && <Tooltip>{t("clients")}</Tooltip>}
                </Link>
              )}
            </div>

            <div>
              {isAdmin && (
                <SectionTitle show={sidebarOpen} title={t("dashboard_layout.catalogs")}/>
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
                  <TbBrandVolkswagen size={iconSize} />
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

              {CheckPermissionForModule("partner_certifications") && (
                <Link to="/dashboard/partner_certifications" className={linkClass("/dashboard/partner_certifications")}>
                  <HiOutlineThumbUp size={iconSize} />
                  <span className={textClass()}>{t("partner_certifications")}</span>
                  {!sidebarOpen && <Tooltip>{t("partner_certifications")}</Tooltip>}
                </Link>
              )}
            </div>

            <div>
              {isAdmin && (
                <SectionTitle show={sidebarOpen} title={t("dashboard_layout.settings")}/>
              )}

              {CheckPermissionForModule("roles") && (
                <Link to="/dashboard/roles" className={linkClass("/dashboard/roles")}>
                  <HiOutlineEye size={iconSize} />
                  <span className={textClass()}>{t("roles")}</span>
                  {!sidebarOpen && <Tooltip>{t("roles")}</Tooltip>}
                </Link>
              )}

              {CheckPermissionForModule("permissions") && (
                <Link to="/dashboard/permissions" className={linkClass("/dashboard/permissions")}>
                  <HiOutlineKey size={iconSize} />
                  <span className={textClass()}>{t("permissions")}</span>
                  {!sidebarOpen && <Tooltip>{t("permissions")}</Tooltip>}
                </Link>
              )}

              {CheckPermissionForModule("modules") && (
                <Link to="/dashboard/modules" className={linkClass("/dashboard/modules")}>
                  <HiOutlineDocumentDuplicate size={iconSize} />
                  <span className={textClass()}>{t("modules")}</span>
                  {!sidebarOpen && <Tooltip>{t("modules")}</Tooltip>}
                </Link>
              )}
            </div>
          </nav>
        </div>

        <div className="border-t border-gray-200 px-3 pt-5 pb-6">
          <button onClick={handleLogout} className="w-full group relative flex items-center justify-center lg:justify-start gap-4 rounded-xl px-4 py-3.5 text-red-600 transition hover:bg-red-50">
            <HiOutlineLogout size={iconSize} className="shrink-0" />
            <span className={textClass()}>{t("dashboard_layout.logout")}</span>
            {!sidebarOpen && <Tooltip>{t("dashboard_layout.logout")}</Tooltip>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 overflow-y-auto max-h-screen ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <HiOutlineMenu size={26} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800">{t("dashboard")}</h2>

            {roleBadge()}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative inline-block">
              <HiOutlineTranslate size={20} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700"/>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="pl-8 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700 focus:ring-[#27B9BA] focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="relative flex items-center gap-3">
              <img
                src={user?.photo_url || "/assets/images/profile.png"}
                className="user-avatar size-10 cursor-pointer rounded-full ring-2 ring-gray-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              />
              {sidebarOpen && (<span className="text-sm font-medium text-gray-700">{user?.name || user?.email}</span>)}
              {userMenuOpen && <UserMenu user={user} />}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

function UserMenu({ user }: { user: any }) {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { t } = useTranslation();

  return (
    <div className="user-menu absolute right-0 top-14 z-50 w-64 rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/5">
      <div className="mb-4 flex items-center gap-3">
        <img src={user?.photo_url || "/assets/images/profile.png"} className="size-12 rounded-full ring-2 ring-gray-200"/>
        <div>
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <button onClick={() => navigate("/dashboard/profile")}className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
          {t("dashboard_layout.profile")}
        </button>

        <button onClick={() => navigate("/dashboard/change-password")} className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100">
          {t("dashboard_layout.change_password")}
        </button>

        <hr />

        <button onClick={() => { logout(); navigate("/login", { replace: true });}}
          className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">
          {t("dashboard_layout.logout")}
        </button>
      </div>
    </div>
  );
}

const Tooltip = ({ children }: { children: string }) => (
  <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#27B9BA] px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 z-9999 shadow-lg before:absolute before:top-1/2 before:right-full before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#27B9BA]">
    {children}
  </span>
);

const SectionTitle = ({ title, show }: { title: string; show: boolean }) =>
  show ? ( <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>) : null;

const SubLink = ({
  to, active, children, onClick,
}: {
  to: string; active: boolean; children: React.ReactNode; onClick?: () => void;
}) => (
  <Link to={to} onClick={onClick}
    className={`block rounded-lg px-4 py-2 text-sm transition ${
      active ? "bg-[#27B9BA]/10 text-[#27B9BA]" : "text-gray-600 hover:bg-[#27B9BA]/10 hover:text-[#27B9BA]"
    }`}
  >
    {children}
  </Link>
);