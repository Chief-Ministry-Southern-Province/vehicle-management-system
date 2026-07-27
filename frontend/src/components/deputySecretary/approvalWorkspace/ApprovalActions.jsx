import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function ApprovalActions({
  onAllocate,
  allocating = false,
  allocated = false,
  allocationReady = false,
  onCancel,
  cancelling = false,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onAllocate}
        disabled={allocating || allocated || !allocationReady}
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-80"
      >
        <FiCheckCircle />
        {allocated
          ? "Vehicle Allocated"
          : allocating
            ? "Allocating..."
            : "Allocate Vehicle"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={cancelling}
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-4 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiXCircle />
        {cancelling ? "Cancelling..." : "Cancel Request"}
      </button>
    </div>
  );
}
