import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles password update request
  const changePassword = async () => {
    if (password !== confirm) {
      return alert(t("password.mismatch"));
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: current,
          new_password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error");
      }

      alert(t("password.updated"));
      setCurrent("");
      setPassword("");
      setConfirm("");
    } catch (error: any) {
      alert(error.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">
        {t("password.title")}
      </h1>

      {/* Change password form */}
      <div className="mx-auto max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <p className="mb-6 text-gray-600">{t("password.description")}</p>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">{t("password.current")}</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("password.new")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">{t("password.confirm")}</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 outline-none focus:bg-white focus:shadow"
            />
          </div>

        </div>

        {/* Submit Action */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={changePassword}
            disabled={loading}
            className="rounded-lg bg-[#27B9BA] px-8 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? t("saving") : t("password.save")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
