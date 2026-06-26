import DashboardLayout from "../../layouts/DashboardLayout";
import RecommendationFilters from "../../components/recommendations/RecommendationFilters";
import RecommendationTable from "../../components/recommendations/RecommendationTable";

import { FiFileText, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PendingRecommendations() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Department Dashboard &gt; Pending Recommendations
            </p>

            <h1 className="text-3xl font-bold">
              Pending Recommendations
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
              <FiFileText />
              Export PDF
            </button>

            <button 
              onClick={() => navigate('/departmentrequesthistory')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FiGrid />
              View All Requests
            </button>
          </div>
        </div>

        <RecommendationFilters />

        <RecommendationTable />

      </div>
    </DashboardLayout>
  );
}