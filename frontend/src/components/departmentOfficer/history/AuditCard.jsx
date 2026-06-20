import {
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";

export default function AuditCard() {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">

      <div className="flex justify-between items-center">

        <div className="flex gap-4">

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FiFileText className="text-blue-600 text-xl" />
          </div>

          <div>

            <h3 className="font-semibold text-blue-900">
              Audit Log & System Transparency
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              All archival entries are immutable.
              Any corrections to past recommendations
              must be logged with the Subject Officer
              for compliance review.
            </p>

          </div>

        </div>

        <button className="bg-white px-5 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2">
          View Dept Analytics
          <FiArrowRight />
        </button>

      </div>

    </div>
  );
}