import { FiFileText, FiClock } from "react-icons/fi";

export default function RequestHeader({ request }) {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <FiFileText className="text-blue-600 text-xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              REQ-{String(request.id).padStart(4, "0")}
            </h1>

            <p className="text-gray-500">
              {request.purpose}
            </p>
          </div>

        </div>

        <div className="text-right">

          <span className="px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium">
            {request.status?.replaceAll("_", " ") || "Pending Deputy Approval"}
          </span>

          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2 justify-end">
            <FiClock />
            Submitted {new Date(request.created_at).toLocaleString()}
          </p>

        </div>

      </div>

    </div>
  );
}
