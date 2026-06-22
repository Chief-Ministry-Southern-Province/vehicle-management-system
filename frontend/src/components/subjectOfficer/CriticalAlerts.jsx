import { FiAlertTriangle } from "react-icons/fi";

const alerts = [
  {
    vehicle: "KAD 012D",
    issue: "Engine Service",
    level: "HIGH",
  },
  {
    vehicle: "KAI 567I",
    issue: "Tire Replacement",
    level: "MEDIUM",
  },
  {
    vehicle: "KAR 234R",
    issue: "Insurance Renewal",
    level: "HIGH",
  },
];

export default function CriticalAlerts() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex justify-between mb-5">

        <h2 className="font-semibold text-xl">
          Critical Alerts
        </h2>

        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
          3 New
        </span>

      </div>

      <div className="space-y-4">

        {alerts.map((alert) => (
          <div
            key={alert.vehicle}
            className="border rounded-xl p-4"
          >
            <div className="flex justify-between">

              <div className="flex gap-3">
                <FiAlertTriangle className="text-red-500" />

                <div className="">
                  <h4 className="font-semibold">
                    {alert.vehicle}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {alert.issue}
                  </p>
                </div>
              </div>

              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                {alert.level}
              </span>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}