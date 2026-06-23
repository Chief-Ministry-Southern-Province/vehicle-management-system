import { FiAlertTriangle } from "react-icons/fi";

export default function PriorityMaintenance() {
  return (
    <div className="bg-white border rounded-xl p-5">

      <h3 className="font-semibold mb-4">
        Priority Maintenance
      </h3>

      <div className="flex gap-3 items-start">

        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
          <FiAlertTriangle className="text-red-600" />
        </div>

        <div>
          <h4 className="font-semibold">
            GV-9021 - Overhaul
          </h4>

          <p className="text-sm text-gray-500">
            Assigned to AutoTech Solutions
          </p>

          <p className="text-xs text-red-500 mt-1">
            Due since 2024-05-15
          </p>
        </div>

      </div>

    </div>
  );
}