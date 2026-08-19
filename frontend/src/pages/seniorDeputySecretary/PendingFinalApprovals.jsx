import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getFinalApprovalVehicleRequests } from "../../api/authApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { formatLocalDateTime as formatDateTime } from "../../utils/dateTime";
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const requesterName = (request) =>
  request.requester_name || request.user?.name || "Unknown requester";

export default function PendingFinalApprovals() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getFinalApprovalVehicleRequests("pending");
        setRequests(response?.data?.requests || []);
      } catch (requestError) {
        setError(
          requestError?.message || "Unable to load pending final approvals.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadPendingRequests();
  }, []);
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header>
          <p className="text-sm font-semibold text-blue-600">
            Senior Assistance Secretary
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Pending Final Approvals
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review requests that have completed vehicle and driver allocation.
          </p>
        </header>

        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.42)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-linear-to-r from-white via-white to-amber-50/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-700 shadow-sm ring-1 ring-amber-200/70">
                <FiClock />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Pending Requests</h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">Final review</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {requests.length} request{requests.length === 1 ? "" : "s"} awaiting final approval
                </p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Allocation complete
            </div>
          </div>

          <div className="hidden lg:block">
            <table className="w-full table-fixed">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
                <tr>
                  <th className="w-[12%] px-6 py-4">Request</th>
                  <th className="w-[20%] px-5 py-4">Requester</th>
                  <th className="w-[14%] px-5 py-4">Department</th>
                  <th className="w-[25%] px-5 py-4">Journey details</th>
                  <th className="w-[19%] px-5 py-4">Schedule</th>
                  <th className="w-[10%] px-6 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => navigate(`/final-approvals/${request.id}`)}
                    className="cursor-pointer transition-colors hover:bg-blue-50/60"
                  >
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1.5 text-sm font-bold text-blue-700">{requestNumber(request.id)}</span>
                    </td>
                    <td className="px-5 py-5 align-top">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><FiUser /></span>
                        <div className="min-w-0"><p className="truncate font-semibold text-slate-800">{requesterName(request)}</p><p className="mt-1 truncate text-xs text-slate-500">{request.user?.employee_id || "Government Employee"}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-5 align-top text-sm font-medium text-slate-600">{request.user?.department || "Not specified"}</td>
                    <td className="px-5 py-5 align-top">
                      <div className="flex gap-2.5"><FiMapPin className="mt-0.5 shrink-0 text-blue-600" /><div className="min-w-0"><p className="truncate font-semibold text-slate-800">{request.destination || "Destination not specified"}</p><p className="mt-1 line-clamp-2 text-sm text-slate-500">{request.purpose || "Purpose not specified"}</p></div></div>
                    </td>
                    <td className="px-5 py-5 align-top text-sm text-slate-600"><p className="font-medium text-slate-700">{formatDateTime(request.departure_at)}</p><p className="mt-1 text-xs text-slate-500">Return: {formatDateTime(request.expected_return_at)}</p></td>
                    <td className="px-6 py-5 text-right align-top">
                      <button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/final-approvals/${request.id}`); }} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                        Review <FiChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 bg-slate-50/70 p-3 sm:p-4 lg:hidden">
            {requests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => navigate(`/final-approvals/${request.id}`)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div><span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1.5 text-sm font-bold text-blue-700">{requestNumber(request.id)}</span><p className="mt-3 font-bold text-slate-900">{requesterName(request)}</p><p className="mt-0.5 text-xs text-slate-500">{request.user?.employee_id || "Government Employee"}</p></div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"><FiArrowUpRight /></span>
                </div>
                <div className="my-4 h-px bg-slate-100" />
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2.5"><FiBriefcase className="mt-0.5 shrink-0 text-slate-400" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Department</p><p className="mt-0.5 font-medium text-slate-700">{request.user?.department || "Not specified"}</p></div></div>
                  <div className="flex gap-2.5"><FiMapPin className="mt-0.5 shrink-0 text-blue-600" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Journey</p><p className="mt-0.5 truncate font-semibold text-slate-800">{request.destination || "Destination not specified"}</p><p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{request.purpose || "Purpose not specified"}</p></div></div>
                  <div className="flex gap-2.5"><FiCalendar className="mt-0.5 shrink-0 text-slate-400" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departure</p><p className="mt-0.5 font-medium text-slate-700">{formatDateTime(request.departure_at)}</p><p className="mt-0.5 text-xs text-slate-500">Return: {formatDateTime(request.expected_return_at)}</p></div></div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-bold text-blue-700"><span>Review final approval</span><FiChevronRight /></div>
              </button>
            ))}
          </div>

          {loading && (
            <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">
              Loading pending requests...
            </div>
          )}
          {!loading && error && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && requests.length === 0 && (
            <div className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500">
              No requests are awaiting final approval.
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
