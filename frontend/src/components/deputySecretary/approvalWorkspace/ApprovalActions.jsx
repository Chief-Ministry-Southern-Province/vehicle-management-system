import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCcw,
} from "react-icons/fi";

export default function ApprovalActions({ onAllocate, allocating = false, allocated = false, allocationReady = false }) {
  return (
    <div className="flex gap-3">

      <button type="button" onClick={onAllocate} disabled={allocating || allocated || !allocationReady} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-80">
        <FiCheckCircle />
        {allocated ? "Vehicle Allocated" : allocating ? "Allocating..." : "Allocate Vehicle"}
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
