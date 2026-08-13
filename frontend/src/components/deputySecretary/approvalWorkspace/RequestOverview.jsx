import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiFileText,
  FiMapPin,
  FiNavigation,
  FiPaperclip,
  FiUsers,
} from "react-icons/fi";
import { formatLocalDateTime } from "../../../utils/dateTime";

function displayLocation(label, latitude, longitude, fallback) {
  if (typeof label === "string" && label.trim()) return label.trim();
  const lat = Number(latitude);
  const lng = Number(longitude);
  return latitude != null && longitude != null && Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    : fallback;
}

export default function RequestOverview({ request }) {
  const attachmentUrl = request.attachment_path
    ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"}/storage/${request.attachment_path}`
    : null;
  const durationMs = new Date(request.expected_return_at) - new Date(request.departure_at);
  const durationHours = Number.isFinite(durationMs) && durationMs > 0
    ? Math.ceil(durationMs / 3600000)
    : null;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <section className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-blue-50 p-3 text-blue-600"><FiFileText size={20} /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Complete request details</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Requester Information</h2>
          </div>
        </div>
        <div className="grid gap-5 text-sm sm:grid-cols-3">
          <div><p className="text-slate-500">Name</p><p className="mt-1 font-semibold text-slate-900">{request.requester_name || request.user?.name || "—"}</p></div>
          <div><p className="text-slate-500">Employee ID</p><p className="mt-1 font-semibold text-slate-900">{request.user?.employee_id || "—"}</p></div>
          <div><p className="text-slate-500">Department</p><p className="mt-1 font-semibold text-slate-900">{request.user?.department || "—"}</p></div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/70 p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Database record</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Request Record</h2>
        </div>
        <div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-slate-500">Request ID</p><p className="mt-1 font-semibold text-slate-900">VMS-REQ-{request.id}</p></div>
          <div><p className="text-slate-500">Workflow Status</p><p className="mt-1 font-semibold capitalize text-slate-900">{request.status?.replaceAll("_", " ") || "—"}</p></div>
          <div><p className="text-slate-500">Submitted At</p><p className="mt-1 font-semibold text-slate-900">{formatLocalDateTime(request.created_at)}</p></div>
          <div><p className="text-slate-500">Last Updated</p><p className="mt-1 font-semibold text-slate-900">{formatLocalDateTime(request.updated_at)}</p></div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Trip details</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Journey Information</h2>
          </div>
          {durationHours && <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700"><FiClock /> {durationHours} hour{durationHours === 1 ? "" : "s"} planned</span>}
        </div>
        <div className="space-y-6 p-6">
          <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-5">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600"><FiNavigation /> Purpose of trip</p>
            <p className="text-base leading-relaxed text-slate-800">{request.purpose || "No purpose provided."}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
              <div className="flex gap-3"><span className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><FiCalendar /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departure</p><p className="mt-1 font-semibold text-slate-800">{formatLocalDateTime(request.departure_at)}</p></div></div>
              <div className="hidden items-center gap-2 text-slate-300 md:flex"><span className="h-px w-8 bg-slate-300" /><FiArrowRight /><span className="h-px w-8 bg-slate-300" /></div>
              <div className="flex gap-3 md:justify-end"><span className="rounded-xl bg-amber-100 p-3 text-amber-700"><FiCalendar /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Expected return</p><p className="mt-1 font-semibold text-slate-800">{formatLocalDateTime(request.expected_return_at)}</p></div></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Route</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><FiMapPin /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Starting location</p><p className="mt-1 break-words font-bold text-slate-900">{displayLocation(request.starting_location, request.starting_latitude, request.starting_longitude, "Starting location not provided")}</p></div></div>
              <div className="flex items-start gap-3"><span className="rounded-xl bg-rose-50 p-3 text-rose-600"><FiMapPin /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Destination</p><p className="mt-1 break-words font-bold text-slate-900">{displayLocation(request.destination, request.destination_latitude, request.destination_longitude, "Destination not provided")}</p></div></div>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Calculated distance</p><p className="mt-1 font-bold text-blue-700">{request.distance_km != null ? `${Number(request.distance_km).toFixed(2)} km` : "Distance not available"}</p></div>
          </div>
        </div>
      </section>

      <div className="grid border-t border-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-slate-100">
        <section className="p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="rounded-xl bg-violet-50 p-3 text-violet-600"><FiUsers size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Travel party</p><h2 className="font-bold text-slate-900">Passengers</h2></div></div><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">{request.passenger_count || 0}</span></div>
          <div className="min-h-16 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{request.passenger_names || "No passenger names provided."}</div>
        </section>
        <section className="border-t border-slate-100 p-6 sm:border-t-0">
          <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-600"><FiPaperclip size={20} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Supporting document</p><h2 className="font-bold text-slate-900">Attachment</h2></div></div>
          {attachmentUrl ? <a href={attachmentUrl} target="_blank" rel="noreferrer" className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 font-semibold text-blue-700 transition hover:bg-blue-100"><span className="min-w-0 truncate">{request.attachment_original_name || "View attachment"}</span><FiArrowRight className="shrink-0" /></a> : <div className="flex min-h-16 items-center rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No attachment provided.</div>}
        </section>
      </div>
    </section>
  );
}
