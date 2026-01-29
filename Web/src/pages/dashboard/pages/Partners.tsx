import { useEffect, useState } from "react";
import { VITE_API_URL } from "../../../config/env";
import { useAuthContext } from "../../../context/AuthContext";
import { RequiredLabel } from "../../../components/form/RequiredLabel";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import type { Partner } from "../../../types/partner";
import type { User } from "../../../types/users";
import Can from "../../../components/Can";
import { authFetch } from "../../../utils/authFetch";

export default function PartnersTable() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [specialities, setSpecialities] = useState<{ id: number; name: string }[]>([]);
  const [allPartnerSpecialities, setAllPartnerSpecialities] = useState<{ partner_id: number; speciality_id: number }[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [landUsePermit, setLandUsePermit] = useState(false);
  const [scannerHandling, setScannerHandling] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { user } = useAuthContext();
  const { t } = useTranslation();

  // Initial load of partners, users and specialities
  useEffect(() => {
    fetchPartners();
    fetchUsers();
    fetchSpecialities();
    fetchAllPartnerSpecialities();
  }, []);

  // Fetch partners list
  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await authFetch(`${VITE_API_URL}/api/partners`, { headers: { Authorization: `Bearer ${token}`, }, });
      const data: Partner[] = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${VITE_API_URL}/api/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch specialities list
  const fetchSpecialities = async () => {
    const res = await authFetch(`${VITE_API_URL}/api/specialities`);
    const data = await res.json();
    setSpecialities(Array.isArray(data) ? data : []);
  };

  // Fetch all partner specialities
  const fetchAllPartnerSpecialities = async () => {
    try {
      const res = await authFetch(`${VITE_API_URL}/api/partner_specialities`);
      const data = await res.json();
      setAllPartnerSpecialities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching all relations:", error);
    }
  };

  // Fetch partner specialities
  const fetchPartnerSpecialities = async (partnerId: number) => {
    const res = await authFetch(`${VITE_API_URL}/api/partner_specialities/${partnerId}`);
    const data: number[] = await res.json();
    setSelectedSpecialities(Array.isArray(data) ? data : []);
  };

  // Helpers
  const getPartnerSpecialities = (partnerId: number) => {
    return allPartnerSpecialities
      .filter(ps => ps.partner_id === partnerId)
      .map(rel => { const spec = specialities.find(s => s.id === rel.speciality_id); return spec?.name; })
      .filter(Boolean) as string[];
  };

  const truncateText = (text?: string, max = 10) => {
    if (!text) return "-";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  // Change priority
  const handlePriorityChange = (value: number) => {
    if (Number.isNaN(value)) return;
    setPriority(Math.min(10, Math.max(1, value)));
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = t("partners_screen.table.name_error");
    if (!userId) newErrors.userId = t("partners_screen.table.user_error");
    if (!phone.trim()) newErrors.phone = t("partners_screen.table.phone_error");
    if (!whatsapp.trim()) newErrors.whatsapp = t("partners_screen.table.whatsapp_error");
    if (!location.trim()) newErrors.location = t("partners_screen.table.location_error");
    if (!latitude.trim()) newErrors.latitude = t("partners_screen.table.latitude_error");
    if (!longitude.trim()) newErrors.longitude = t("partners_screen.table.longitude_error");
    if (!logoUrl.trim()) newErrors.logoUrl = t("partners_screen.table.logo_url_error");
    if (!description.trim()) newErrors.description = t("partners_screen.table.description_error");
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Open create modal
  const openCreate = () => {
    setIsEditing(false);
    setSubmitted(false);
    setErrors({});
    setCurrentPartner(null);
    setSelectedSpecialities([]);
    setName("");
    if (user?.role_name === "partner") {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
    setPhone("");
    setWhatsapp("");
    setLocation("");
    setLatitude("");
    setLongitude("");
    setLandUsePermit(false);
    setScannerHandling(false);
    setLogoUrl("");
    setDescription("");
    setPriority(10);
    setOpenModal(true);
  };

  // Open edit modal
  const openEdit = (partner: Partner) => {
    setIsEditing(true);
    setSubmitted(false);
    setErrors({});
    setCurrentPartner(partner);
    fetchPartnerSpecialities(partner.id);
    setName(partner.name);
    setUserId(partner.user_id);
    setPhone(partner.phone);
    setWhatsapp(partner.whatsapp);
    setLocation(partner.location);
    setLatitude(partner.latitude || "");
    setLongitude(partner.longitude || "");
    setLandUsePermit(Boolean(partner.land_use_permit));
    setScannerHandling(Boolean(partner.scanner_handling));
    setLogoUrl(partner.logo_url || "");
    setDescription(partner.description || "");
    setPriority(partner.priority);
    setOpenModal(true);
  };

  // Create or update partner
  const savePartner = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const body = { name, user_id: userId, phone, whatsapp, location, latitude, longitude, land_use_permit: landUsePermit, scanner_handling: scannerHandling, logo_url: logoUrl, description, priority };
    const url = isEditing ? `${VITE_API_URL}/api/partners/${currentPartner?.id}` : `${VITE_API_URL}/api/partners`;
    const method = isEditing ? "PUT" : "POST";
    const token = localStorage.getItem("token");

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const partnerId = isEditing ? currentPartner?.id : data?.id;

    await fetch(`${VITE_API_URL}/api/partner_specialities`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
      body: JSON.stringify({ partner_id: partnerId, speciality_ids: selectedSpecialities, }),
    });

    alert(t(isEditing ? "partners_screen.success.update" : "partners_screen.success.create"));
    setOpenModal(false);
    fetchPartners();
    fetchAllPartnerSpecialities();
  };

  // Actions
  const deletePartner = async (partner: Partner) => {
    const confirmed = window.confirm(t("partners_screen.confirm.deactivate", { name: partner.name }));
    if (!confirmed) return;

    const res = await authFetch(`${VITE_API_URL}/api/partners/${partner.id}`, { method: "DELETE", });

    if (!res.ok) { alert(t("partners_screen.errors.deactivate")); return; }

    alert(t("partners_screen.success.deactivate"));
    fetchPartners();
  };

  // Restore partner
  const restorePartner = async (partner: Partner) => {
    const confirmed = window.confirm(t("partners_screen.confirm.restore", { name: partner.name }));
    if (!confirmed) return;

    const res = await authFetch(`${VITE_API_URL}/api/partners/${partner.id}/restore`, { method: "PATCH", });

    if (!res.ok) { alert(t("partners_screen.errors.restore")); return; }

    alert(t("partners_screen.success.restore"));
    fetchPartners();
  };

  // Filter partners by name
  const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("partners_screen.title")}</h1>

      {/* Search input and create button */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("partners_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Can permission="create_partners">
          <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6]">
            {t("partners_screen.add_button")}
          </button>
        </Can>
      </div>

      {/* Partners table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("partners_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="min-w-[1400px] table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-12">{t("partners_screen.table.id")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.name")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.phone")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.whatsapp")}</th>
                  <th className="pb-3 ">{t("partners_screen.table.location")}</th>
                  <th className="pb-3 w-30 text-center">{t("partners_screen.table.land_use_permit")}</th>
                  <th className="pb-3 w-40 text-center">{t("partners_screen.table.scanner_handling")}</th>
                  <th className="pb-3 w-32 text-center">{t("partners_screen.table.logo_url")}</th>
                  <th className="pb-3 px-4">{t("partners_screen.table.description")}</th>
                  <th className="pb-3 px-4">{t("partners_screen.table.specialities")}</th>
                  <th className="pb-3 px-4 text-center w-24">{t("partners_screen.table.priority")}</th>
                  <th className="pb-3 px-4 text-center w-28">{t("users_screen.table.status")}</th>
                  <th className="pb-3 w-32 text-right">{t("partners_screen.table.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 text-gray-700">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3 font-semibold">{item.name}</td>
                    <td className="py-3">{item.phone}</td>
                    <td className="py-3">{item.whatsapp}</td>
                    <td className="py-3 max-w-xs">
                      <span className="block text-sm truncate cursor-help" title={item.location}>
                        {truncateText(item.location, 10)}
                      </span>
                    </td>
                    <td className="py-3 w-40 text-center">{item.land_use_permit ? "✔" : "✖"}</td>
                    <td className="py-3 w-40 text-center">{item.scanner_handling ? "✔" : "✖"}</td>
                    <td className="py-3 w-32"> {item.logo_url ? (
                      <div className="flex justify-center">
                        <img
                          src={item.logo_url}
                          alt="logo"
                          className=" h-10 w-10 object-contain transition-transform duration-200 ease-out hover:scale-[6] hover:z-20 origin-center cursor-zoom-in"
                        />
                      </div>
                    ) : ("-")}
                    </td>

                    <td className="py-3 px-4">
                      <span className="block text-sm truncate cursor-help" title={item.description || ""}>
                        {truncateText(item.description, 10)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {(() => {
                        const specs = getPartnerSpecialities(item.id);

                        if (specs.length === 0) { return <span className="text-gray-400 text-sm">-</span>; }

                        const visible = specs.slice(0, 2);
                        const hiddenCount = specs.length - visible.length;

                        return (
                          <div className="text-sm text-gray-700" title={specs.join("\n")}>
                            <ul className="list-disc list-outside pl-4 space-y-0.5 leading-snug">
                              {visible.map((name, idx) => (<li key={idx}>{name}</li>))}
                              {hiddenCount > 0 && (<li className="text-gray-400 italic"> +{hiddenCount} {t("partners_screen.table.hidden")}</li>)}
                            </ul>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold">{item.priority}</td>

                    <td className="py-3 px-4 text-center">
                      <span
                        title={item.deleted_at ? t("users_screen.table.status_inactive") : t("users_screen.table.status_active")}
                        className={`inline-block w-3 h-3 rounded-full ${item.deleted_at ? "bg-red-500" : "bg-green-500"}`}
                      />
                    </td>

                    <td className="py-3 text-right space-x-3">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        {!item.deleted_at && (
                          <Can permission="update_partners">
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600" onClick={() => openEdit(item)}>
                              {t("users_screen.edit")}
                            </button>
                          </Can>
                        )}

                        {!item.deleted_at && (
                          <Can permission="delete_partners">
                            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700" onClick={() => deletePartner(item)}>
                              {t("users_screen.delete")}
                            </button>
                          </Can>
                        )}

                        {item.deleted_at && (
                          <Can permission="delete_partners">
                            <button className="px-2.5 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700" onClick={() => restorePartner(item)}>
                              {t("users_screen.restore")}
                            </button>
                          </Can>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={13} className="text-center py-6 text-gray-500">{t("partners_screen.no_results")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / edit partner modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] max-h-[90vh] rounded-2xl p-6 shadow-xl border border-gray-200 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{isEditing ? t("partners_screen.edit_title") : t("partners_screen.create_title")}</h2>
            <div className="overflow-y-auto pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <RequiredLabel required>{t("partners_screen.table.name")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.name ? "border-red-500" : "border-gray-300"}`}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })); }}
                    placeholder={t("partners_screen.table.name_placeholder")}
                  />
                  {submitted && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="col-span-2">
                  <RequiredLabel required>{t("partners_screen.table.user")}</RequiredLabel>
                  <select
                    className={`w-full border border-gray-300 px-3 py-2 rounded-lg ${user?.role_name === "partner" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : " "}`}
                    value={user?.role_name === "partner" ? user.id : userId ?? ""}
                    disabled={user?.role_name === "partner"}
                    onChange={(e) => setUserId(Number(e.target.value))}
                  >
                    <option value="">{t("partners_screen.select_user")}</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <RequiredLabel required>{t("partners_screen.table.phone")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} `}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: "" })); }}
                    placeholder="Ej. +521 551 234 5678"
                  />
                  {submitted && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <RequiredLabel required>{t("partners_screen.table.whatsapp")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${errors.whatsapp ? "border-red-500" : "border-gray-300"
                      }`}
                    value={whatsapp}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Permitir solo + al inicio y números
                      value = value.replace(/(?!^\+)[^\d]/g, "");
                      // Evitar más de un +
                      if ((value.match(/\+/g) || []).length > 1) {
                        value = value.replace(/\+/g, "");
                      }
                      setWhatsapp(value);
                      setErrors((prev) => ({ ...prev, whatsapp: "" }));
                    }}

                    placeholder="+521 551 234 5678"
                  />
                  {submitted && errors.whatsapp && (
                    <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <RequiredLabel required>{t("partners_screen.table.location")}</RequiredLabel>
                  <textarea
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.location ? "border-red-500" : "border-gray-300"}`}
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: "" })); }}
                    placeholder="Ej. Av. Insurgentes Sur 123, Col. Roma Norte, CDMX"
                  />
                  {submitted && errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <RequiredLabel required>{t("partners_screen.table.latitude")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.latitude ? "border-red-500" : "border-gray-300"}`}
                    value={latitude}
                    onChange={(e) => {
                      setLatitude(e.target.value); setErrors((prev) => ({ ...prev, latitude: "" }));
                    }}
                    placeholder="25.0000"
                  />
                  {submitted && errors.latitude && (
                    <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
                  )}
                </div>

                <div>
                  <RequiredLabel required>{t("partners_screen.table.longitude")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.longitude ? "border-red-500" : "border-gray-300"}`}
                    value={longitude}
                    onChange={(e) => {
                      setLongitude(e.target.value); setErrors((prev) => ({ ...prev, longitude: "" }));
                    }}
                    placeholder="-100.0000"
                  />
                  {submitted && errors.longitude && (
                    <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <RequiredLabel required>{t("partners_screen.table.logo_url")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.logoUrl ? "border-red-500" : "border-gray-300"}`}
                    value={logoUrl}
                    onChange={(e) => { setLogoUrl(e.target.value); setErrors((prev) => ({ ...prev, logoUrl: "" })); }}
                    placeholder={t("partners_screen.table.logo_url_placeholder")}
                  />
                  {submitted && errors.logoUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.logoUrl}</p>
                  )}

                  {logoUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="h-16 w-16 object-contain border rounded-lg bg-white"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="text-xs text-gray-500">{t("partners_screen.table.logo_url_preview")}</span>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <RequiredLabel required>{t("partners_screen.table.description")}</RequiredLabel>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border ${submitted && errors.description ? "border-red-500" : "border-gray-300"}`}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setErrors((prev) => ({ ...prev, description: "" })); }}
                    placeholder={t("partners_screen.table.description_placeholder")}
                  />
                  {submitted && errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={landUsePermit} onChange={(e) => setLandUsePermit(e.target.checked)} />
                  <span className="text-sm">{t("partners_screen.table.land_use_permit")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={scannerHandling} onChange={(e) => setScannerHandling(e.target.checked)} />
                  <span className="text-sm">{t("partners_screen.table.scanner_handling")}</span>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.priority")}</label>

                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={priority}
                    disabled={user?.role_name !== "admin"}
                    onChange={(e) =>
                      handlePriorityChange(Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">{t("partners_screen.table.specialities")}</label>

                  <div className="border border-gray-300 rounded-lg p-3 max-h-[140px] overflow-y-auto grid grid-cols-2 gap-2">
                    {[...specialities]
                      .sort((a, b) => a.name.localeCompare(b.name, "es"))
                      .map((s) => (
                        <label key={s.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedSpecialities.includes(s.id)}
                            onChange={(e) =>
                              e.target.checked
                                ? setSelectedSpecialities([...selectedSpecialities, s.id])
                                : setSelectedSpecialities(
                                  selectedSpecialities.filter((id) => id !== s.id)
                                )
                            }
                          />
                          {s.name}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setOpenModal(false); setErrors({}); setSubmitted(false); }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("partners_screen.cancel")}
              </button>

              <Can permission={isEditing ? "update_partners" : "create_partners"}>
                <button onClick={savePartner} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                  {isEditing ? t("partners_screen.save") : t("partners_screen.create")}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
