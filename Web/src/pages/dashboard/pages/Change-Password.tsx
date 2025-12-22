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

  const changePassword = async () => {
    if (password !== confirm) {
      return alert(t("password.mismatch"));
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${VITE_API_URL}/api/users/change-password`, {
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

    if (!data.ok) {
      alert(data.message);
    } else {
      alert(t("password.updated"));
      setCurrent("");
      setPassword("");
      setConfirm("");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">{t("password.title")}</h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-md border">
        <div className="space-y-4">
          <input
            type="password"
            placeholder={t("password.current")}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="password"
            placeholder={t("password.new")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="password"
            placeholder={t("password.confirm")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={changePassword}
            disabled={loading}
            className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg hover:bg-[#1da5a6]"
          >
            {t("password.save")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
