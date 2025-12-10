import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import  type { Certification } from "../../../types/certification";

export default function CertificationsTable() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/partner_certifications`);
            const data = await res.json();

            setCertifications(data.certifications || []);
        } catch (error) {
            console.error("Error fetching certifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = certifications.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Certifications</h1>

            {/* SEARCH + ADD BUTTON */}
            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Search certification..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                    Add Certification
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading...</p>
                ) : (
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr className="text-gray-600 border-b">
                                <th className="pb-3">ID</th>
                                <th className="pb-3">Partner ID</th>
                                <th className="pb-3">Name</th>
                                <th className="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2">{item.id}</td>
                                    <td className="py-2">{item.partner_id ?? "—"}</td>
                                    <td className="py-2">{item.name}</td>

                                    <td className="py-2 text-right space-x-4">
                                        <button className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                                            Edit
                                        </button>
                                        <button className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-500">
                                        No certifications found
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
