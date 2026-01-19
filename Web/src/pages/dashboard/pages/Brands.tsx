import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { CarBrands } from "../../../types/car_brands";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";
import { authFetch } from "../../../utils/authFetch";

export default function CarBrands() {
  const { t } = useTranslation();
  const [carBrands, setCarBrands] = useState<CarBrands[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<CarBrands | null>(null);
  const [name, setName] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Initial load
  useEffect(() => { fetchCarBrands(); }, []);

  // Fetch car brands list
  const fetchCarBrands = async () => {
    try {
      const res = await authFetch(`${VITE_API_URL}/api/car_brands`);
      const data = await res.json();
      setCarBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching car brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t("car_brands_screen.table.name_error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal in create mode
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentBrand(null);
    setName("");
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  // Open modal in edit mode
  const handleEdit = (brand: CarBrands) => {
    setIsEditing(true);
    setCurrentBrand(brand);
    setName(brand.name);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  // Create or update car brand
  const saveBrand = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    try {
      const isEdit = isEditing && currentBrand;
      const url = isEdit ? `${VITE_API_URL}/api/car_brands/${currentBrand!.id}` : `${VITE_API_URL}/api/car_brands`;
      const method = isEdit ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        alert(t(isEdit ? "car_brands_screen.errors.update" : "car_brands_screen.errors.create"));
        return;
      }

      alert( t(isEdit ? "car_brands_screen.success.update" : "car_brands_screen.success.create"));

      setOpenModal(false);
      fetchCarBrands();
    } catch (error) {
      console.error("Error saving car brand:", error);
    }
  };

  // Delete car brand
  const handleDelete = async (brand: CarBrands) => {
    const confirmed = window.confirm( t("car_brands_screen.confirm.delete", { name: brand.name }));
    if (!confirmed) return;

    const res = await authFetch(`${VITE_API_URL}/api/car_brands/${brand.id}`,{ method: "DELETE" });

    if (!res.ok) {
      alert(t("car_brands_screen.errors.delete"));
      return;
    }

    alert(t("car_brands_screen.success.delete"));
    fetchCarBrands();
  };

  // Filter car brands by name
  const filtered = carBrands.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("car_brands_screen.title")}</h1>

      {/* Search input and create button */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("car_brands_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_brands">
          <button onClick={handleCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
            {t("car_brands_screen.add_button")}
          </button>
        </Can>
      </div>

      {/* Car brands table */}
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
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right space-x-5">
                      <Can permission="update_brands">
                        <button onClick={() => handleEdit(item)} className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                          {t("car_brands_screen.edit")}
                        </button>
                      </Can>

                      <Can permission="delete_brands">
                        <button onClick={() => handleDelete(item)} className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                          {t("car_brands_screen.delete")}
                        </button>
                      </Can>
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

      {/* Create / edit car brand modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("car_brands_screen.edit_title") : t("car_brands_screen.create_title")}
            </h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("car_brands_screen.table.name")}</RequiredLabel>

                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.name ? "border-red-500" : "border-gray-300"}`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                  placeholder="Ej. Toyota"
                />
                {submitted && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setOpenModal(false); setErrors({}); setSubmitted(false); }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("car_brands_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_brands" : "create_brands"}>
                <button onClick={saveBrand} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("car_brands_screen.save") : t("car_brands_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
