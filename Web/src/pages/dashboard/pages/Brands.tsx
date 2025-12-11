import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { CarBrands } from "../../../types/car_brands";

export default function CarBrands() {
  const { t } = useTranslation();
  const [carBrands, setCarBrands] = useState<CarBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<CarBrands | null>(null);
  const [name, setName] = useState("");

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

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentBrand(null);
    setName("");
    setOpenModal(true);
  };

  const handleEdit = (brand: CarBrands) => {
    setIsEditing(true);
    setCurrentBrand(brand);
    setName(brand.name);
    setOpenModal(true);
  };

  const saveBrand = async () => {
    try {
      const url = isEditing
        ? `${VITE_API_URL}/api/car_brands/${currentBrand?.id}`
        : `${VITE_API_URL}/api/car_brands`;

      const method = isEditing ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      setOpenModal(false);
      fetchCarBrands();
    } catch (error) {
      console.error("Error saving car brand:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Eliminar marca?");
    if (!confirmDelete) return;

    try {
      await fetch(`${VITE_API_URL}/api/car_brands/${id}`, {
        method: "DELETE",
      });

      fetchCarBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const filtered = carBrands.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("car_brands_screen.title")}</h1>
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("car_brands_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
        >
          {t("car_brands_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("car_brands_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">{t("car_brands_screen.table.id")}</th>
                  <th className="pb-3">{t("car_brands_screen.table.name")}</th>
                  <th className="pb-3 text-right">{t("car_brands_screen.table.actions")}</th>
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
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        {t("car_brands_screen.edit")}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        {t("car_brands_screen.delete")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      {t("car_brands_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing
                ? t("car_brands_screen.edit_title")
                : t("car_brands_screen.create_title")}
            </h2>

            <label className="block text-sm font-medium text-gray-700">
              {t("car_brands_screen.table.name")}
            </label>

            <input
              type="text"
              className="w-full mt-2 mb-4 px-3 py-2 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                {t("cancel")}
              </button>

              <button
                onClick={saveBrand}
                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg"
              >
                {isEditing ? t("save") : t("create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
