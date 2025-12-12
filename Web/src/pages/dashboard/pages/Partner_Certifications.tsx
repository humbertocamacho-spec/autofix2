import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";

type Partner = { id: number; name: string };
type Certification = { id: number; name: string };
type PartnerCertification = {
  id: number;
  partner_id: number;
  certification_id: number;
  partner_name: string;
  certification_name: string;
};

export default function PartnersCertificationsTable() {
  const { t } = useTranslation();

  const [partnerCertifications, setPartnerCertifications] = useState<PartnerCertification[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<PartnerCertification | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<number | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pcRes, partnersRes, certsRes] = await Promise.all([
        fetch(`${VITE_API_URL}/api/partner_certifications`).then(r => r.json()),
        fetch(`${VITE_API_URL}/api/partners`).then(r => r.json()),
        fetch(`${VITE_API_URL}/api/certifications`).then(r => r.json()),
      ]);
      setPartnerCertifications(Array.isArray(pcRes) ? pcRes : []);
      setPartners(Array.isArray(partnersRes) ? partnersRes : []);
      setCertifications(Array.isArray(certsRes) ? certsRes : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    setSelectedPartner(null);
    setSelectedCertification(null);
    setOpenModal(true);
  };

  const openEditModal = (item: PartnerCertification) => {
    setEditing(item);
    setSelectedPartner(item.partner_id);
    setSelectedCertification(item.certification_id);
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!selectedPartner || !selectedCertification) return alert("Selecciona partner y certificación");

    try {
      if (editing) {
        await fetch(`${VITE_API_URL}/api/partner_certifications/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partner_id: selectedPartner, certification_id: selectedCertification }),
        });
      } else {
        await fetch(`${VITE_API_URL}/api/partner_certifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partner_id: selectedPartner, certification_id: selectedCertification }),
        });
      }
      fetchAllData();
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta certificación del partner?")) return;

    try {
      await fetch(`${VITE_API_URL}/api/partner_certifications/${id}`, { method: "DELETE" });
      fetchAllData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const filtered = partnerCertifications.filter(
    pc =>
      pc.partner_name.toLowerCase().includes(search.toLowerCase()) ||
      pc.certification_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("partner_certifications_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("partner_certifications_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
        >
          {t("partner_certifications_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("partner_certifications_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-20">{t("partner_certifications_screen.table.id")}</th>
                  <th className="pb-3">{t("partner_certifications_screen.table.partner_name")}</th>
                  <th className="pb-3">{t("partner_certifications_screen.table.certification_name")}</th>
                  <th className="pb-3 text-right w-48 pr-6">{t("partner_certifications_screen.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3 truncate">{item.partner_name}</td>
                    <td className="py-3 truncate">{item.certification_name}</td>
                    <td className="py-3 text-right pr-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                        >
                          {t("partner_certifications_screen.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          {t("partner_certifications_screen.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      {t("partner_certifications_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editing ? t("partner_certifications_screen.edit") : t("partner_certifications_screen.add_button")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">{t("partner_certifications_screen.table.partner_name")}</label>
                <select
                  value={selectedPartner || ""}
                  onChange={(e) => setSelectedPartner(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Partner</option>
                  {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">{t("partner_certifications_screen.table.certification_name")}</label>
                <select
                  value={selectedCertification || ""}
                  onChange={(e) => setSelectedCertification(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Certification</option>
                  {certifications.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={() => setOpenModal(false)}>
                {t("partner_certifications_screen.cancel")}
              </button>
              <button className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition" onClick={handleSave}>
                {editing ? t("partner_certifications_screen.save") : t("partner_certifications_screen.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
