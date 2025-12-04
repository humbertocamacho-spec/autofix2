import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiChevronDown, HiChevronRight, HiOutlineHome, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineChat, HiOutlineChartBar, HiOutlineCollection, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";

interface Props { children: ReactNode; }

export default function DashboardLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const location = useLocation();
    const handleToggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside
                className={`bg-white shadow-lg border-r transition-all duration-300 
        flex flex-col
        ${sidebarOpen ? "w-72" : "w-20"}`}
            >
                <div className="flex items-center justify-between p-5 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">
                        {sidebarOpen ? "Vora." : "V"}
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-600 hover:text-gray-800 lg:block hidden"
                    >
                        <HiMenu size={26} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <ul className="mt-4 px-3 space-y-2">
                        <li>
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                ${location.pathname === "/dashboard"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineHome size={22} />
                                {sidebarOpen && <span className="font-medium">Dashboard</span>}
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/partners"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                ${location.pathname === "/dashboard/partners"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineUsers size={22} />
                                {sidebarOpen && <span className="font-medium">Partners</span>}
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={() => handleToggleMenu("projects")}
                                className={`flex items-center w-full justify-between p-3 rounded-lg transition
                ${openMenu === "projects" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                            >
                                <div className="flex items-center gap-4 text-gray-700">
                                    <HiOutlineClipboardList size={22} />
                                    {sidebarOpen && <span className="font-medium">Projects</span>}
                                </div>

                                {sidebarOpen && (
                                    openMenu === "projects" ? <HiChevronDown /> : <HiChevronRight />
                                )}
                            </button>

                            {openMenu === "projects" && sidebarOpen && (
                                <ul className="ml-12 mt-2 space-y-2">
                                    <li>
                                        <Link to="/projects/list" className="block text-sm text-gray-600 hover:text-blue-600">
                                            Project List
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/projects/create" className="block text-sm text-gray-600 hover:text-blue-600">
                                            Create Project
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link
                                to="/clients"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                  ${location.pathname === "/clients"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineUserGroup size={22} />
                                {sidebarOpen && <span className="font-medium">Clients</span>}
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/messages"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                  ${location.pathname === "/messages"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineChat size={22} />
                                {sidebarOpen && <span className="font-medium">Messages</span>}
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={() => handleToggleMenu("apps")}
                                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <HiOutlineCollection size={22} />
                                    {sidebarOpen && <span className="font-medium">Apps</span>}
                                </div>

                                {sidebarOpen && (
                                    openMenu === "apps" ? <HiChevronDown /> : <HiChevronRight />
                                )}
                            </button>

                            {openMenu === "apps" && sidebarOpen && (
                                <ul className="ml-12 mt-2 space-y-2">
                                    <li><Link to="/calendar" className="text-sm text-gray-600 hover:text-blue-600">Calendar</Link></li>
                                    <li><Link to="/todo" className="text-sm text-gray-600 hover:text-blue-600">To-Do</Link></li>
                                    <li><Link to="/email" className="text-sm text-gray-600 hover:text-blue-600">Email</Link></li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link
                                to="/charts"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                  ${location.pathname === "/charts"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineChartBar size={22} />
                                {sidebarOpen && <span className="font-medium">Charts</span>}
                            </Link>
                        </li>


                        <li className="pt-4 border-t">
                            <Link
                                to="/settings"
                                className={`flex items-center gap-4 p-3 rounded-lg transition
                  ${location.pathname === "/settings"
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                <HiOutlineCog size={22} />
                                {sidebarOpen && <span className="font-medium">Settings</span>}
                            </Link>
                        </li>

                    </ul>
                </div>
                <div className="mt-auto p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}
                        className="w-full flex items-center gap-3 text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
                    >
                        <HiOutlineLogout className="text-xl" />
                        Logout
                    </button>
                </div>

            </aside>

            <div className="flex flex-col flex-1">

                <header className="h-16 bg-white shadow flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden block" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <HiMenu size={28} />
                        </button>
                        <h2 className="text-xl font-semibold">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="hidden md:block px-4 py-2 bg-gray-100 rounded-lg text-sm outline-none"
                        />
                        <img
                            src="https://i.pravatar.cc/40"
                            className="w-10 h-10 rounded-full cursor-pointer"
                        />
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}