import DashboardLayout from "../layouts/DashboardLayout";
import { HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineClipboardCheck, HiOutlineMail, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import type { StatCardProps } from "../../../types/startcardprops";
import { useTranslation } from "react-i18next";

const StatCard = ({ title, value, icon, trend, trendUp = true }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm font-medium mt-3 flex items-center ${trendUp ? "text-green-600" : "text-red-600"}`}>
              <span className="mr-1">{trendUp ? "↑" : "↓"}</span>
              {trend}
            </p>
          )}
        </div>
        <div className="p-4 bg-[#27B9BA]/10 rounded-2xl">
          <div className="text-[#27B9BA]">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default function Overview() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("overview.title")}</h1>
        <p className="text-gray-600 mt-2">{t("overview.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <StatCard
          title={t("overview.stats.totalProjects")}
          value="78"
          icon={<HiOutlineBriefcase size={28} />}
          trend={t("overview.stats.projectTrend")}
          trendUp={true}
        />

        <StatCard
          title={t("overview.stats.totalContacts")}
          value="214"
          icon={<HiOutlineUserGroup size={28} />}
          trend={t("overview.stats.contactsTrend")}
          trendUp={true}
        />

        <StatCard
          title={t("overview.stats.unfinishedTasks")}
          value="93"
          icon={<HiOutlineClipboardCheck size={28} />}
          trend={t("overview.stats.tasksTrend")}
          trendUp={false}
        />

        <StatCard
          title={t("overview.stats.unreadMessages")}
          value="12"
          icon={<HiOutlineMail size={28} />}
          trend={t("overview.stats.messagesTrend")}
          trendUp={true}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t("overview.todo.title")}</h3>
            <button className="text-[#27B9BA] hover:bg-[#27B9BA]/10 px-3 py-1.5 rounded-lg text-sm font-medium transition">
              {t("overview.buttons.viewAll")}
            </button>
          </div>

          <div className="space-y-6">

            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                {t("overview.todo.design")}
              </span>

              <h4 className="font-semibold text-gray-900 mt-3">
                {t("overview.todo.item1")}
              </h4>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t("overview.progress")}</span>
                  <span className="font-medium">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: "24%" }} />
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {t("overview.todo.development")}
              </span>

              <h4 className="font-semibold text-gray-900 mt-3">
                {t("overview.todo.item2")}
              </h4>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t("overview.progress")}</span>
                  <span className="font-medium">79%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: "79%" }} />
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-[#27B9BA]/10 text-[#27B9BA] rounded-full">
                {t("overview.todo.marketing")}
              </span>

              <h4 className="font-semibold text-gray-900 mt-3">
                {t("overview.todo.item3")}
              </h4>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t("overview.progress")}</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#27B9BA] h-2.5 rounded-full transition-all duration-500" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t("overview.upcoming.title")}</h3>
            <button className="text-[#27B9BA] hover:bg-[#27B9BA]/10 px-3 py-1.5 rounded-lg text-sm font-medium transition">
              {t("overview.buttons.seeAll")}
            </button>
          </div>

          <div className="space-y-6">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-[#27B9BA] to-[#1e9a9b] rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                K
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#27B9BA] font-medium">Kripton Inc.</p>
                <h4 className="font-bold text-gray-900">{t("overview.upcoming.project1")}</h4>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><HiOutlineCalendar size={16} /> Sep 8th, 2025</span>
                  <span className="flex items-center gap-1"><HiOutlineClock size={16} /> {t("overview.upcoming.weeks2")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                E
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-600 font-medium">Etza Studio</p>
                <h4 className="font-bold text-gray-900">{t("overview.upcoming.project2")}</h4>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><HiOutlineCalendar size={16} /> Sep 12th, 2025</span>
                  <span className="flex items-center gap-1"><HiOutlineClock size={16} /> {t("overview.upcoming.weeks3")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm text-orange-600 font-medium">AutoFix Internal</p>
                <h4 className="font-bold text-gray-900">{t("overview.upcoming.project3")}</h4>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><HiOutlineCalendar size={16} /> Oct 1st, 2025</span>
                  <span className="flex items-center gap-1"><HiOutlineClock size={16} /> {t("overview.upcoming.weeks4")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
