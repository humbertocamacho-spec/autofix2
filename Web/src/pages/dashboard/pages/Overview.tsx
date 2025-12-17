import DashboardLayout from "../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";

export default function Overview() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="relative min-h-[70vh]">
        <div className="absolute inset-0  flex justify-center items-center pointer-events-none select-none  opacity-10">
          <img src="/assets/images/Logo.jpg" className="w-[50%] max-w-[500px] grayscale object-contain" alt="watermark"/>
        </div>

        <div className="relative z-10 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("overview.title")}</h1>
          <p className="text-gray-600 mt-2">{t("overview.subtitle")}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
