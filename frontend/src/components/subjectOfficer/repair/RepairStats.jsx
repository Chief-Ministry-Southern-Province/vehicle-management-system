import {
  FiAlertTriangle,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

export default function RepairStats() {
  return (
    <div className="grid grid-cols-3 gap-5">

      <div className="bg-white border rounded-xl p-5">
        <FiAlertTriangle className="text-red-500 text-xl mb-3" />

        <p className="text-xs text-gray-500 uppercase">
          Critical Fleet Issues
        </p>

        <h2 className="text-3xl font-bold mt-2">
          12 Active
        </h2>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <FiDollarSign className="text-blue-500 text-xl mb-3" />

        <p className="text-xs text-gray-500 uppercase">
          MTD Repair Spend
        </p>

        <h2 className="text-3xl font-bold mt-2">
          $4,852
        </h2>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <FiClock className="text-gray-700 text-xl mb-3" />

        <p className="text-xs text-gray-500 uppercase">
          Avg Return Time
        </p>

        <h2 className="text-3xl font-bold mt-2">
          2.4 Days
        </h2>
      </div>
    </div>
  );
}