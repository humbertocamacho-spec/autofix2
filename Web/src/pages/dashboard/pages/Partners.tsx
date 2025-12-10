import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Partner } from "../../../types/partner";

export default function PartnersTable() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/partners`);
            const data = await res.json();
            setPartners(data);
        } catch (error) {
            console.error("Error fetching partners:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = partners.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.id - b.id);;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Partners</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Search partner..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    + Add Partner
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading...</p>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full table-auto text-left border-collapse">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="pb-3 w-12">ID</th>
                                    <th className="pb-3 w-64">Name</th>
                                    <th className="pb-3 w-40">Phone</th>
                                    <th className="pb-3 w-40">WhatsApp</th>
                                    <th className="pb-3">Location</th>
                                    <th className="pb-3 w-20 text-center">Priority</th>
                                    <th className="pb-3 w-32 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">

                                        <td className="py-3">{item.id}</td>
                                        <td className="py-3 font-semibold">{item.name}</td>
                                        <td className="py-3">{item.phone}</td>
                                        <td className="py-3">{item.whatsapp}</td>
                                        <td className="py-3 max-w-xs whitespace-normal">
                                            {item.location}
                                        </td>
                                        <td className="py-3 text-center">{item.priority}</td>

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
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No partners found
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
