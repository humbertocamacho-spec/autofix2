import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";
import type { Profile } from "../../../types/profile";

export default function ProfileScreen() {
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoInput, setPhotoInput] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProfile(data.user);
    } catch {
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(t("profile.updated"));
      fetchProfile();
    } catch (error: any) {
      alert(error.message || t("error"));
    } finally {
      setSaving(false);
    }
  };

  const openPhotoModal = () => {
    setPhotoInput(profile?.photo_url || "");
    setShowPhotoModal(true);
  };

  const savePhotoUrl = () => {
    if (!profile) return;
    setProfile({ ...profile, photo_url: photoInput });
    setShowPhotoModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="py-10 text-center text-gray-500">
          {t("dashboard_layout.loading")}
        </p>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">{t("profile.title")}</h1>

      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow-2xl">

        <div className="mb-10 flex flex-col items-center">
          <img
            src={profile.photo_url || "/assets/images/profile.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover"
          />

          <button onClick={openPhotoModal} className="mt-3 text-sm font-medium text-[#27B9BA] hover:underline">
            {t("profile.changePhoto")}
          </button>
        </div>


        <div className="grid grid-cols-2 gap-6">

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">{t("profile.name")}</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("profile.email")}</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("profile.phone")}</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">{t("profile.address")}</label>
            <input
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">{t("profile.role")}</label>
            <input
              disabled
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-500"
              value={profile.role_name}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="rounded-lg bg-[#27B9BA] px-8 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? t("saving") : t("profile.save")}
          </button>
        </div>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">{t("profile.changePhoto")}</h3>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 mb-4 outline-none"
              placeholder="Pega la URL de la foto"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPhotoModal(false)} className="rounded-lg bg-gray-200 px-4 py-2">
                {t("profile.cancel")}
              </button>
              <button onClick={savePhotoUrl} className="rounded-lg bg-[#27B9BA] px-4 py-2 text-white">
                {t("profile.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
