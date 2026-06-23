import DashboardLayout from "../../layouts/DashboardLayout";

import FleetStats from "../../components/subjectOfficer/FleetStats";
import FleetStatusGrid from "../../components/subjectOfficer/FleetStatusGrid";
import CriticalAlerts from "../../components/subjectOfficer/CriticalAlerts";
import MaintenanceChart from "../../components/subjectOfficer/MaintenanceChart";
import FuelLogs from "../../components/subjectOfficer/FuelLogs";
import TodayAssignments from "../../components/subjectOfficer/TodayAssignments";
import SupportCard from "../../components/subjectOfficer/SupportCard";

import {FiBarChart2,FiPlus} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SubjectOfficerDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-4xl font-bold">
              Fleet Operations Overview
            </h1>

            <p className="text-gray-500 mt-2">
              Monitoring 128 active vehicles across 14 government departments.
            </p>
          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-50">
              <FiBarChart2 />
              View Analytics
            </button>

            <button 
              onClick={() => navigate('/registervehicle')} 
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">
              <FiPlus />
              Register Vehicle
            </button>

          </div>

        </div>

        <FleetStats />

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <FleetStatusGrid />
          </div>

          <div className="space-y-6">
            <CriticalAlerts />
            <MaintenanceChart />
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <FuelLogs />

          <TodayAssignments />

          <SupportCard />

        </div>

      </div>
    </DashboardLayout>
  );
}