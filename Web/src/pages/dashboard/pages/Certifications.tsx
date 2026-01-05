import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Certification } from "../../../types/certification";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import Can from "../../../components/Can";

export default function CertificationsTable() {
  const { t } = useTranslation();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Certification | null>(null);

  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Initial data fetch on component mount
  useEffect(() => { fetchCertifications();}, []);

  // Fetch certifications from API
  const fetchCertifications = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/certifications`);
      const data = await res.json();
      setCertifications(data.certifications || []);
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) { newErrors.name = t("certifications_screen.table.name_error");}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal in create mode
  const openCreate = () => {
    setIsEditing(false);
    setCurrent(null);
    setName("");
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  // Open modal in edit mode with selected item
  const openEdit = (item: Certification) => {
    setIsEditing(true);
    setCurrent(item);
    setName(item.name);
    setErrors({});
    setSubmitted(false);
    setOpenModal(true);
  };

  // Create or update certification
  const saveCertification = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${VITE_API_URL}/api/certifications/${current?.id}` : `${VITE_API_URL}/api/certifications`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setOpenModal(false);
    fetchCertifications();
  };

  // Delete certification
  const deleteCertification = async (certification: Certification) => {
    const confirmed = window.confirm(t("certifications_screen.confirm.deactivate", { name: certification.name,}));
    if (!confirmed) return;

    const res = await fetch( `${VITE_API_URL}/api/certifications/${certification.id}`, { method: "DELETE" });

    if (!res.ok) { alert(t("certifications_screen.errors.deactivate")); return;}

    alert(t("certifications_screen.success.deactivate"));
    fetchCertifications();
  };

  // Filter certifications by name
  const filtered = certifications.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("certifications_screen.title")}</h1>

      {/* Search input and create button */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("certifications_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_certifications">
          <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
            {t("certifications_screen.add_button")}
          </button>
        </Can>
      </div>

      {/* Certifications table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("certifications_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">{t("certifications_screen.table.id")}</th>
                  <th className="pb-3">{t("certifications_screen.table.name")}</th>
                  <th className="pb-3 text-right">{t("certifications_screen.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{item.id}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right space-x-4">
                      <Can permission="update_certifications">
                        <button onClick={() => openEdit(item)} className="px-5 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                          {t("certifications_screen.edit")}
                        </button>
                      </Can>

                      <Can permission="delete_certifications">
                        <button onClick={() => deleteCertification(item)} className="px-5 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                          {t("certifications_screen.delete")}
                        </button>
                      </Can>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      {t("certifications_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / edit certification modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("certifications_screen.edit_title") : t("certifications_screen.create_title")}
            </h2>

            <div className="space-y-4">
              <div>
                <RequiredLabel required>{t("certifications_screen.name")}</RequiredLabel>

                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.name ? "border-red-500" : "border-gray-300"}`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                  placeholder="Ej. Certificación ASE"
                />
                {submitted && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setOpenModal(false); setErrors({}); setSubmitted(false); }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("certifications_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_certifications" : "create_certifications"}>
                <button onClick={saveCertification} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("certifications_screen.save") : t("certifications_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
