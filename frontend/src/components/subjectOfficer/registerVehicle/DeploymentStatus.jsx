import {
  FiMapPin,
  FiInfo,
} from "react-icons/fi";

export default function DeploymentStatus() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-5">

        <FiMapPin className="text-blue-600" />

        <h3 className="text-xl font-bold">
          Deployment Status
        </h3>

      </div>

      <label className="block text-sm font-medium mb-2">
        Initial Assignment
      </label>

      <select className="w-full border rounded-xl px-4 py-3">
        <option>General Pool</option>
        <option>Finance Department</option>
        <option>Administration</option>
        <option>Public Works</option>
      </select>

      <div className="mt-4 bg-gray-50 rounded-xl p-4 flex gap-3">

        <FiInfo className="text-gray-500 mt-1" />

        <p className="text-sm text-gray-600">
          Vehicle will be marked inactive until first
          inspection is completed.
        </p>

      </div>

    </div>
  );
}