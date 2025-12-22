import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";

type Profile = {
  name: string;
  email: string;
  phone: string;
  role_name: string;
};

export default function ProfileScreen() {
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${VITE_API_URL}/api/auth/me`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    setProfile(data.user);
    setLoading(false);
    };

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    const token = localStorage.getItem("token");

    await fetch(`${VITE_API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
        }),
    });

    setSaving(false);
    alert(t("profile.updated"));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-500 py-10">
          {t("loading")}
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        {t("profile.title")}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              {t("profile.email")}
            </label>
            <input
              value={profile?.email}
              disabled
              className="w-full bg-gray-100 border px-4 py-2 rounded-lg"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              {t("profile.name")}
            </label>
            <input
              value={profile?.name}
              onChange={(e) =>
                setProfile({ ...profile!, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              {t("profile.phone")}
            </label>
            <input
              value={profile?.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile!, phone: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#27B9BA]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              {t("profile.role")}
            </label>
            <input
              value={profile?.role_name}
              disabled
              className="w-full bg-gray-100 border px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-6 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] disabled:opacity-60"
          >
            {saving ? t("saving") : t("profile.save")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
