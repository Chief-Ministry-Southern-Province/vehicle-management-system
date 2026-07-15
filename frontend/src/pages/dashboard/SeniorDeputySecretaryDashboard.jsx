import DashboardLayout from "../../layouts/DashboardLayout";

export default function SeniorDeputySecretaryDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Jane!
            </h1>

            <p className="text-gray-500 mt-1">
              You have 4 trips scheduled for today. Drive safely.
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="bg-white border px-5 py-3 rounded-xl">
              Schedule
            </button>

            <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
              Quick Log
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Card */}
          <div className="col-span-12 sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="flex flex-col h-full p-5">
              <header>
                <h2 className="font-semibold text-slate-800">Trips</h2>
              </header>
              <div className="grow">
                {/* Chart */}
                <div className="mt-2 h-40">
                  <canvas id="chart1"></canvas>
                </div>
              </div>              
            </div>
          </div>          
        </div>
      </div>
    </DashboardLayout>
  );
}