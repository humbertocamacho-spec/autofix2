import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { CarBrands } from "../../../types/car_brands";

export default function CarBrands() {
  const [carBrands, setCarBrands] = useState<CarBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCarBrands();
  }, []);

  const fetchCarBrands = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/car_brands`);
      const data = await res.json();
      setCarBrands(data);
    } catch (error) {
      console.error("Error fetching car brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = carBrands.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Car Brands</h1>
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search car brand..."
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
          Add Car Brand
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 text-gray-700"
                  >
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right space-x-5">
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
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No specialities found
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
