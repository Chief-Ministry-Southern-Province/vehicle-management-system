import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";
import RequestOverview from "../../components/deputySecretary/approvalWorkspace/RequestOverview";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getApprovalVehicleRequest, getApprovalVehicleRequests } from "../../api/authApi";
import { formatLocalDateTime } from "../../utils/dateTime";
const statusStyle = {
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  vehicle_allocated:
    "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  recommended: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  submitted: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  completed: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",
  cancelled: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

function recordLocation(request, prefix, t) {
  const label = prefix === "starting" ? request.starting_location : request.destination;
  if (label) return label;
  const lat = request[`${prefix}_latitude`], lng = request[`${prefix}_longitude`];
  return lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    ? `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}` : t("odometer.notRecorded");
}

function routeLocationName(request, prefix, t) {
  const label = prefix === "starting" ? request.starting_location : request.destination;
  return label ? label.split(",")[0].trim() : recordLocation(request, prefix, t);
}

function ApprovalRecordDetails({ id, onClose }) {
  const { t } = useLanguage();
  const dialog = useRef(null);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    let active = true;
    getApprovalVehicleRequest(id).then(response => {
      if (!response?.data?.vehicle_request) throw new Error(t("approvalRecords.loadError"));
      if (active) setRequest(response.data.vehicle_request);
    }).catch(err => { if (active) setError(err?.message || t("approvalRecords.loadError")); });
    return () => { active = false; element.close(); };
  }, [id, t]);
  const r = request;
  const fields = r ? [
    [t("fuel.requester"), r.requester_name || r.user?.name],
    [t("approvalRecords.employeeId"), r.user?.employee_id],
    [t("fuel.department"), r.user?.department],
    [t("approvalRecords.status"), r.status],
    ...["recommendation_status", "department_priority", "journey_status", "rejected_by", "cancelled_by"]
      .map(key => [t(`approvalRecords.${key}`), r[key]]),
    [t("fuel.recommender"), r.recommender?.name], [t("fuel.notes"), r.recommendation_notes],
    [t("fuel.vehicle"), r.allocated_vehicle?.registration_number],
    [t("approvalRecords.vehicleModel"), [r.allocated_vehicle?.make, r.allocated_vehicle?.model].filter(Boolean).join(" ")],
    [t("fuel.driverName"), r.allocated_driver?.full_name], [t("fuel.driverId"), r.allocated_driver?.driver_id],
    [t("approvalRecords.driverContact"), r.allocated_driver?.contact_number],
    [t("fuel.parking"), r.parking_location], [t("fuel.allocator"), r.allocator?.name], [t("fuel.approver"), r.approver?.name],
    [t("fuel.reallocation"), r.reallocation_reason], [t("approvalRecords.reallocator"), r.reallocator?.name],
    [t("approvalRecords.previousVehicle"), r.previous_allocated_vehicle?.registration_number],
    [t("approvalRecords.previousDriver"), r.previous_allocated_driver?.full_name],
    ...["created_at", "updated_at", "cancelled_at", "rejected_at"].map(key => [t(`approvalRecords.${key}`), formatLocalDateTime(r[key], t("odometer.notRecorded"))]),
    ...["recommended_at", "allocated_at", "approved_at", "reallocated_at", "journey_started_at", "journey_completed_at"]
      .map(key => [t(`fuel.${key}`), formatLocalDateTime(r[key], t("odometer.notRecorded"))]),
    ...[["start", r.start_odometer_km], ["end", r.end_odometer_km], ["actual", r.actual_distance_km]]
      .map(([key, value]) => [t(`odometer.${key}`), value == null ? null : `${Number(value).toFixed(2)} km`]),
  ] : [];
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="approval-record-title"
    className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl backdrop:bg-slate-950/50">
    <header className="mb-5 flex items-center justify-between gap-3">
      <h2 id="approval-record-title" className="text-lg font-bold">REQ-{String(id).padStart(4, "0")} — {t("nav.details")}</h2>
      <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 focus-visible:ring-2">{t("fuel.close")}</button>
    </header>
    {error ? <p role="alert" className="p-5 text-red-700">{error}</p> : !r ? <p role="status">{t("approvalRecords.loading")}</p> : <>
      <RequestOverview request={r} />
      <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="min-w-0">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="mt-1 break-words whitespace-pre-wrap text-sm">{value == null || value === "" ? t("odometer.notRecorded") : String(value)}</dd>
      </div>)}</dl>
    </>}
  </dialog>;
}
function StatCard({ icon, label, value, tone, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${tone}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Approval records</p>
      <div className={`absolute inset-x-0 bottom-0 h-0.5 ${accent}`} />
    </div>
  );
}
export default function TotalApprovals() {
  const { t } = useLanguage();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getApprovalVehicleRequests("all");
        setRequests(response?.data?.requests || []);
        setStats(
          response?.data?.stats || {
            all: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
        );
      } catch (loadError) {
        setError(loadError?.message || "Unable to load approval records.");
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);
  const visibleRequests = useMemo(() => {
    const search = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus =
        status === "all" ||
        (status === "pending"
          ? !["approved", "completed", "rejected", "cancelled"].includes(
              request.status,
            )
          : request.status === status);
      const matchesSearch =
        !search ||
        String(request.id).includes(search) ||
        request.requester_name?.toLowerCase().includes(search) ||
        request.user?.department?.toLowerCase().includes(search) ||
        request.starting_location?.toLowerCase().includes(search) ||
        request.destination?.toLowerCase().includes(search) ||
        request.purpose?.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [query, requests, status]);
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Deputy secretary workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Approval Register</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Review request progress, recommendations, and allocation-ready journeys in one place.</p>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-r border-slate-200 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Total records</p>
              <p className="mt-0.5 text-lg font-extrabold leading-none text-slate-900">{stats.all}</p>
            </div>
            <div className="px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Awaiting action</p>
              <p className="mt-0.5 text-lg font-extrabold leading-none text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
          <StatCard
            icon={<FiFileText />}
            label="Total Requests"
            value={stats.all}
            tone="bg-blue-100 text-blue-600"
            accent="bg-blue-500"
          />
          <StatCard
            icon={<FiClock />}
            label="Pending"
            value={stats.pending}
            tone="bg-amber-100 text-amber-600"
            accent="bg-amber-500"
          />
          <StatCard
            icon={<FiCheckCircle />}
            label="Approved"
            value={stats.approved}
            tone="bg-emerald-100 text-emerald-600"
            accent="bg-emerald-500"
          />
          <StatCard
            icon={<FiXCircle />}
            label="Rejected"
            value={stats.rejected}
            tone="bg-rose-100 text-rose-600"
            accent="bg-rose-500"
          />
        </div>
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                <FiFileText />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Official Approval Records</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{visibleRequests.length}</span> of {requests.length} records
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Complete</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
                {["requestNumber", "requester", "department", "purposeRouteTime", "status", "view"].map(key =>
                  <th key={key} className="px-5 py-4">{t(`approvalRecords.${key}`)}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {!loading && !error && visibleRequests.map(request => <tr key={request.id} className="align-top hover:bg-blue-50/70">
                  <td className="whitespace-nowrap px-5 py-5 font-bold text-blue-700">REQ-{String(request.id).padStart(4, "0")}</td>
                  <td className="px-5 py-5 font-semibold">{request.requester_name || request.user?.name || t("odometer.notRecorded")}</td>
                  <td className="px-5 py-5">{request.user?.department || t("odometer.notRecorded")}</td>
                  <td className="min-w-72 px-5 py-5">
                    <p className="font-semibold">{request.purpose || t("odometer.notRecorded")}</p>
                    <p className="mt-2 text-slate-600">{routeLocationName(request, "starting", t)} - {routeLocationName(request, "destination", t)}</p>
                    <p className="mt-2 text-xs text-slate-500">{t("fuel.departure_at")}: {formatLocalDateTime(request.departure_at)}</p>
                    <p className="mt-1 text-xs text-slate-500">{t("fuel.expected_return_at")}: {formatLocalDateTime(request.expected_return_at)}</p>
                  </td>
                  <td className="px-5 py-5"><span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle[request.status] || "bg-slate-100 text-slate-600"}`}>{request.status?.replaceAll("_", " ")}</span></td>
                  <td className="px-5 py-5"><button type="button" onClick={() => setSelectedRequest(request.id)}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
                    {t("approvalRecords.view")}</button></td>
                </tr>)}
                {loading && <tr><td colSpan={6} className="p-10 text-center text-slate-500">Loading approval records...</td></tr>}
                {!loading && error && <tr><td colSpan={6} className="p-5 text-center text-red-700">{error}</td></tr>}
                {!loading && !error && !visibleRequests.length && <tr><td colSpan={6} className="p-10 text-center text-slate-500">No approval records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {selectedRequest != null && <ApprovalRecordDetails id={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </DashboardLayout>
  );
}
