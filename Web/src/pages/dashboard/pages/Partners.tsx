import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import type { Partner } from "../../../types/partner";
import type { User } from "../../../types/users";
import { useAuthContext } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function PartnersTable() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const [specialities, setSpecialities] = useState<{ id: number; name: string }[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>([]);


  useEffect(() => {
    fetchPartners();
    fetchUsers();
    fetchSpecialities();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/partners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Partner[] = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSpecialities = async () => {
    const res = await fetch(`${VITE_API_URL}/api/specialities`);
    const data = await res.json();
    setSpecialities(data);
  };

  const fetchPartnerSpecialities = async (partnerId: number) => {
    const res = await fetch(`${VITE_API_URL}/api/partner_specialities/${partnerId}`);
    const data: number[] = await res.json();
    setSelectedSpecialities(data);
  };



  const openCreate = () => {
    setIsEditing(false);
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

  const openEdit = (partner: Partner) => {
    setIsEditing(true);
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

  const savePartner = async () => {
    if (!name || !userId) return alert("Name y User son requeridos");

    const body = { name, user_id: userId, phone, whatsapp, location, latitude, longitude, land_use_permit: landUsePermit, scanner_handling: scannerHandling, logo_url: logoUrl, description, priority };
    const url = isEditing ? `${VITE_API_URL}/api/partners/${currentPartner?.id}` : `${VITE_API_URL}/api/partners`;
    const method = isEditing ? "PUT" : "POST";
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const partnerId = isEditing ? currentPartner?.id : data?.id;

    //Guardar especialidades
    await fetch(`${VITE_API_URL}/api/partner_specialities`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
      body: JSON.stringify({
        partner_id: partnerId,
        speciality_ids: selectedSpecialities,
      }),
    });


    setOpenModal(false);
    fetchPartners();
  };

  const deletePartner = async (id: number) => {
    if (!confirm("¿Eliminar Partner?")) return;
    await fetch(`${VITE_API_URL}/api/partners/${id}`, { method: "DELETE" });
    fetchPartners();
  };

  const filtered = partners
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  const handlePriorityChange = (value: number) => {
    if (Number.isNaN(value)) return;
    setPriority(Math.min(10, Math.max(1, value)));
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("partners_screen.title")}</h1>

      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder={t("partners_screen.search_placeholder")}
          className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={openCreate} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6]">
          {t("partners_screen.add_button")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        {loading ? (
          <p className="text-center py-10 text-gray-500">{t("partners_screen.loading")}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="min-w-[1400px] table-auto text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3 w-12">{t("partners_screen.table.id")}</th>
                  <th className="pb-3 w-64">{t("partners_screen.table.name")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.phone")}</th>
                  <th className="pb-3 w-40">{t("partners_screen.table.whatsapp")}</th>
                  <th className="pb-3 ">{t("partners_screen.table.location")}</th>
                  <th className="pb-3">{t("partners_screen.table.latitude")}</th>
                  <th className="pb-3">{t("partners_screen.table.longitude")}</th>
                  <th className="pb-3 w-40 text-center">{t("partners_screen.table.land_use_permit")}</th>
                  <th className="pb-3 w-40 text-center">{t("partners_screen.table.scanner_handling")}</th>
                  <th className="pb-3 w-32 text-center">{t("partners_screen.table.logo_url")}</th>
                  <th className="pb-3  w-[320px]">{t("partners_screen.table.description")}</th>
                  <th className="pb-3 w-20 text-center">{t("partners_screen.table.priority")}</th>
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
                    <td className="py-3  max-w-xs whitespace-normal wrap-break-words">{item.location}</td>
                    <td className="py-3 text-sm">{item.latitude || "-"}</td>
                    <td className="py-3 text-sm">{item.longitude || "-"}</td>
                    <td className="py-3 w-40 text-center">{item.land_use_permit ? "✔" : "✖"}</td>
                    <td className="py-3 w-40 text-center">{item.scanner_handling ? "✔" : "✖"}</td>
                    <td className="py-3 w-32 flex justify-center">{item.logo_url ? (<img src={item.logo_url} className="h-10 w-10 object-contain" />) : "-"}</td>
                    <td className="py-3 w-[320px] whitespace-normal wrap-break-words text-sm leading-relaxed">{item.description || "-"}</td>
                    <td className="py-3 w-24 text-center font-semibold">{item.priority}</td>
                    <td className="py-3 text-right space-x-3">
                      <button onClick={() => openEdit(item)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600">
                        {t("partners_screen.edit")}
                      </button>
                      <button onClick={() => deletePartner(item.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        {t("partners_screen.delete")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      {t("partners_screen.no_results")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[450px] max-h-[90vh] rounded-2xl shadow-xl border border-gray-200 flex flex-col">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isEditing ? t("partners_screen.edit_title") : t("partners_screen.create_title")}
            </h2>



            <div className="overflow-y-auto px-6 pb-4">
              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.name")}</label>
                  <input className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.user")}</label>
                  <select
                    className={`w-full border px-3 py-2 rounded-lg
                  ${user?.role_name === "partner"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:ring-2 focus:ring-[#27B9BA]"
                      }`}
                    value={user?.role_name === "partner" ? user.id : userId ?? ""}
                    disabled={user?.role_name === "partner"}
                    onChange={(e) => setUserId(Number(e.target.value))}
                  >
                    <option value="">{t("partners_screen.select_user")}</option>

                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.phone")}</label>
                  <input className="w-full border border-gray-300 px-3 py-2 rounded-lg" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.whatsapp")}</label>
                  <input className="w-full border border-gray-300 px-3 py-2 rounded-lg" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.location")}</label>
                  <textarea className="w-full border border-gray-300 px-3 py-2 rounded-lg" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.latitude")}</label>
                  <input className="w-full border px-3 py-2 rounded-lg" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.longitude")}</label>
                  <input className="w-full border px-3 py-2 rounded-lg" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.logo_url")}</label>
                  <input className="w-full border px-3 py-2 rounded-lg" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">{t("partners_screen.table.description")}</label>
                  <input className="w-full border px-3 py-2 rounded-lg" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                    placeholder="Priority"
                    value={priority}
                    onChange={(e) => handlePriorityChange(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Especialidades
                  </label>

                  <div className="border border-gray-300 rounded-lg p-3 max-h-[140px] overflow-y-auto grid grid-cols-2 gap-2">
                    {specialities.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedSpecialities.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSpecialities([...selectedSpecialities, s.id]);
                            } else {
                              setSelectedSpecialities(
                                selectedSpecialities.filter((id) => id !== s.id)
                              );
                            }
                          }}
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-white rounded-b-2xl">
              <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                {t("partners_screen.cancel")}
              </button>
              <button onClick={savePartner} className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition">
                {isEditing ? t("partners_screen.save") : t("partners_screen.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
