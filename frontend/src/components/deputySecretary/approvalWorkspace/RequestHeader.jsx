import { FiFileText, FiClock } from "react-icons/fi";
import { formatLocalDateTime } from "../../../utils/dateTime";

export default function RequestHeader({ request }) {
  return (
    <header className="overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white shadow-xl shadow-blue-900/10">
      <div className="flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
            <FiFileText className="text-xl text-blue-100" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Vehicle allocation review</p>
            <h1 className="mt-1 text-3xl font-bold">
              REQ-{String(request.id).padStart(4, "0")}
            </h1>

            <p className="mt-2 text-sm text-blue-100">{request.purpose}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2 text-sm font-semibold capitalize text-amber-100">
            {request.status?.replaceAll("_", " ") ||
              "Pending Vehicle Allocation"}
          </span>

          <p className="mt-3 flex items-center gap-2 text-sm text-blue-100 sm:justify-end">
            <FiClock />
            Submitted {formatLocalDateTime(request.created_at)}
          </p>
        </div>
      </div>
    </header>
  );
}
