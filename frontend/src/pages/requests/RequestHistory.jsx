import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiClock, FiEye, FiMapPin, FiUsers } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import HistoryFilters from "../../components/employee/HistoryFilters";
import { getMyVehicleRequests } from "../../api/authApi";
import { formatLocalDateTime } from "../../utils/dateTime";
const statusColor = {
  approved: "bg-green-100 text-green-700",
  vehicle_allocated: "bg-indigo-100 text-indigo-700",
  completed: "bg-blue-100 text-blue-700",
  submitted: "bg-yellow-100 text-yellow-700",
  recommended: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};
export default function RequestHistory({
  title = "Request History",
  description = "View all your vehicle requests, including approved requests.",
  detailBasePath = "/employee/requests",
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const status = searchParams.get("status") === "approved" ? "approved" : "all";
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getMyVehicleRequests();
        setRequests(response?.data?.requests || []);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load request history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const counts = useMemo(
    () => ({
      all: requests.length,
      approved: requests.filter((request) =>
        ["approved", "completed"].includes(request.status),
      )
        .length,
    }),
    [requests],
  );
  const visibleRequests = useMemo(() => {
    const search = query.trim().toLowerCase();
    return requests.filter(
      (request) =>
        (status === "all" ||
          ["approved", "completed"].includes(request.status)) &&
        (!search ||
          String(request.id).includes(search) ||
          request.destination?.toLowerCase().includes(search) ||
          request.purpose?.toLowerCase().includes(search)),
    );
  }, [query, requests, status]);
  const changeStatus = (nextStatus) =>
    setSearchParams(
      nextStatus === "approved"
        ? {
            status: "approved",
          }
        : {},
    );
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-6">
        <header className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-blue-950 to-blue-800 px-5 py-5 text-white shadow-[0_18px_50px_-28px_rgba(30,64,175,0.9)] sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">Vehicle requests</p>
            <h1 className="mt-1.5 text-xl font-bold leading-tight sm:text-3xl">{title}</h1>
            <p className="mt-1.5 max-w-3xl text-xs leading-5 text-blue-100/90 sm:text-sm">{description}</p>
          </div>
        </header>
        <HistoryFilters
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={changeStatus}
          counts={counts}
        />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Pax</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-100 transition hover:bg-blue-50/40">
                    <td className="p-4 font-medium text-blue-600">
                      REQ-{String(request.id).padStart(4, "0")}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatLocalDateTime(request.created_at)}
                    </td>
                    <td className="p-4">{request.destination}</td>
                    <td className="p-4 text-gray-600">{request.purpose}</td>
                    <td className="p-4 text-center">
                      {request.passenger_count}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[request.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {request.status?.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`${detailBasePath}/${request.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        aria-label={`View request REQ-${String(request.id).padStart(4, "0")}`}
                      >
                        <FiEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-sm text-gray-500"
                    >
                      Loading request history...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan={7}
                      className="bg-red-50 p-5 text-center text-sm text-red-700"
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && visibleRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-sm text-gray-500"
                    >
                      {status === "approved"
                        ? "No approved requests found."
                        : "You have not submitted any vehicle requests."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {!loading && !error && visibleRequests.map((request) => {
              const requestCode = `REQ-${String(request.id).padStart(4, "0")}`;
              return (
                <article key={request.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold tracking-wide text-blue-700">{requestCode}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500"><FiCalendar className="shrink-0" />{formatLocalDateTime(request.created_at)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${statusColor[request.status] || "bg-gray-100 text-gray-700"}`}>
                      {request.status?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="flex items-start gap-2 text-sm font-semibold text-slate-800"><FiMapPin className="mt-0.5 shrink-0 text-blue-600" /><span className="break-words">{request.destination || "Destination not provided"}</span></p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{request.purpose || "Purpose not provided"}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"><FiUsers />{request.passenger_count} pax</span>
                    </div>
                    <button type="button" onClick={() => navigate(`${detailBasePath}/${request.id}`)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition active:scale-95" aria-label={`View request ${requestCode}`}><FiArrowRight /></button>
                  </div>
                </article>
              );
            })}
            {loading && <div className="p-10 text-center text-sm text-slate-500"><FiClock className="mx-auto mb-2 animate-pulse text-xl text-blue-500" />Loading request history...</div>}
            {!loading && error && <div className="bg-red-50 p-5 text-center text-sm text-red-700">{error}</div>}
            {!loading && !error && visibleRequests.length === 0 && <div className="p-10 text-center text-sm text-slate-500">{status === "approved" ? "No approved requests found." : "You have not submitted any vehicle requests."}</div>}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-500 sm:text-sm">
            Showing {visibleRequests.length} of {requests.length} requests
            <span className="font-semibold text-slate-400">Request archive</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
