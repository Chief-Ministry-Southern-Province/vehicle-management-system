import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCcw,
} from "react-icons/fi";

export default function ApprovalActions({ onApprove, approving = false, approved = false }) {
  return (
    <div className="flex gap-3">

      <button type="button" onClick={onApprove} disabled={approving || approved} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-emerald-600 disabled:opacity-80">
        <FiCheckCircle />
        {approved ? "Allocated Vehicle" : approving ? "Allocating..." : "Allocate Vehicle"}
      </button>

      <button className="w-14 h-14 border rounded-xl flex items-center justify-center text-red-500">
        <FiXCircle />
      </button>

      <button className="w-14 h-14 border rounded-xl flex items-center justify-center">
        <FiRefreshCcw />
      </button>

    </div>
  );
}
