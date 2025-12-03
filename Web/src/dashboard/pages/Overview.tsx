import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import Tabs from "../components/Tabs";
import TimelineChart from "../components/TimelineChart";
import RadialChart from "../components/RadialChart";
import NewClientsChart from "../components/NewClientsChart";

export default function Overview() {
  const [activeTab, setActiveTab] = useState("Daily");

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <StatCard
          number="78"
          label="Total Project Handled"
          iconColor="#2953E8"
          iconPath="M34.4221 13.9831C34.3342..."
        />

        <StatCard
          number="214"
          label="Contacts You Have"
          iconColor="#2953E8"
          iconPath="M17.8936 22.4999C23.6925..."
        />

        <StatCard
          number="93"
          label="Total Unfinished Task"
          iconColor="#2953E8"
          iconPath="M12 1.5H6C3.51472..."
        />

        <StatCard
          number="12"
          label="Unread Messages"
          iconColor="#2953E8"
          iconPath="M34.4998 1.91666H11.4998..."
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold">Project Created</h4>

          <Tabs
            tabs={["Daily", "Weekly", "Monthly"]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="mb-6 flex items-center">
          <span className="text-3xl font-bold mr-4">
            {activeTab === "Daily" && "0.45%"}
            {activeTab === "Weekly" && "5.75%"}
            {activeTab === "Monthly" && "1.20%"}
          </span>

          <div className="flex items-center text-gray-600">
            <svg width="27" height="14">
              <path d="M0 13.435L13.435 0L26.8701 13.435H0Z" fill="#2FCA51" />
            </svg>
            <span className="ml-2">last month $563,443</span>
          </div>
        </div>

        <TimelineChart tab={activeTab} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4">Monthly Target</h4>
          <RadialChart percentage={75} />
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4">New Clients</h4>
          <NewClientsChart />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow p-6 h-[500px] overflow-y-auto">
          <h4 className="text-xl font-bold mb-4">Quick To-Do List</h4>

          <div className="space-y-6">
            <div>
              <span className="px-3 py-1 text-xs bg-green-200 text-green-700 rounded">Graphic Designer</span>
              <p className="font-bold mt-2">Visual Graphic for Presentation to Client</p>

              <div className="mt-3">
                <p className="text-sm font-semibold">
                  Progress <span className="float-right">24%</span>
                </p>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded" style={{ width: "24%" }} />
                </div>
              </div>
            </div>

            <div>
              <span className="px-3 py-1 text-xs bg-purple-200 text-purple-700 rounded">Digital Marketing</span>
              <p className="font-bold mt-2">Build Database Design for Fasto Admin v2</p>

              <div className="mt-3">
                <p className="text-sm font-semibold">
                  Progress <span className="float-right">79%</span>
                </p>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: "79%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-[500px] overflow-y-auto">
          <h4 className="text-xl font-bold mb-4">Upcoming Projects</h4>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-blue-500 mb-1 font-medium">Yoast Esac</p>
              <h4 className="font-bold">Redesign Kripton Mobile App</h4>
              <p className="text-sm mt-2">
                <i className="fa fa-calendar text-gray-500 mr-2"></i> Created on Sep 8th, 2020
              </p>
            </div>

            <div>
              <p className="text-sm text-blue-500 mb-1 font-medium">Yoast Esac</p>
              <h4 className="font-bold">Build Branding Persona for Etza.id</h4>
              <p className="text-sm mt-2">
                <i className="fa fa-calendar text-gray-500 mr-2"></i> Created on Sep 8th, 2020
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="text-xl font-bold mb-4">Recent Messages</h4>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/40?img=1" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold">Chandara Kiev</p>
              <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet...</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/40?img=2" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold">Samuel Quequee</p>
              <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet...</p>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}
