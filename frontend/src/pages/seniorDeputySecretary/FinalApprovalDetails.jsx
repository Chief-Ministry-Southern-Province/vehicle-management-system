import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiMapPin,
  FiNavigation,
  FiShield,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  finalApproveVehicleRequest,
  finalRejectVehicleRequest,
  getFinalApprovalVehicleRequest,
} from "../../api/authApi";
import { formatLocalDateTime as formatDateTime } from "../../utils/dateTime";
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;

function displayLocation(label, latitude, longitude, fallback) {
  if (typeof label === "string" && label.trim()) return label.trim();
  const lat = Number(latitude);
  const lng = Number(longitude);
  return latitude != null && longitude != null && Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    : fallback;
}

function displayDistance(distance) {
  if (distance == null || distance === "") return "Distance not available";
  const numericDistance = Number(distance);
  return Number.isFinite(numericDistance)
    ? `${numericDistance.toFixed(2)} km`
    : "Distance not available";
}
function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">
        {children ?? "—"}
      </dd>
    </div>
  );
}
function Card({ title, icon, children, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</span>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Final review</p><h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2></div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
function VehicleAllocationDetails({ request }) {
  const vehicle = request.allocated_vehicle;
  const driver = request.allocated_driver;
  const allocator = request.allocator;
  if (
    !request.allocated_vehicle_id ||
    !request.allocated_driver_id ||
    !vehicle ||
    !driver
  ) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        No vehicle allocation is stored for this request. The Assistance Secreatry
        must allocate both a driver and vehicle before final approval.
      </div>
    );
  }
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      <Detail label="Vehicle name">
        {[vehicle.make, vehicle.model].filter(Boolean).join(" ") || "—"}
      </Detail>
      <Detail label="Registration number">{vehicle.registration_number}</Detail>
      <Detail label="Vehicle type">{vehicle.vehicle_type}</Detail>
      <Detail label="Number of vehicle seats">
        {vehicle.seat_capacity ?? "Not recorded"}
      </Detail>
      <Detail label="Driver's name">{driver.full_name}</Detail>
      <Detail label="Contact number">{driver.contact_number}</Detail>
      <Detail label="Driver ID number">{driver.driver_id}</Detail>
      <Detail label="NIC number">{driver.nic}</Detail>
      <Detail label="Allocated by">{allocator?.name}</Detail>
      <Detail label="Allocator employee ID">{allocator?.employee_id}</Detail>
      <Detail label="Allocated at">
        {formatDateTime(request.allocated_at)}
      </Detail>
      <Detail label="Parking location">
        <span className="whitespace-pre-wrap">{request.parking_location}</span>
      </Detail>
      <Detail label="Driver notified at">
        {formatDateTime(request.driver_notified_at)}
      </Detail>
      <Detail label="Request status">
        <span className="capitalize">
          {request.status?.replaceAll("_", " ")}
        </span>
      </Detail>
      {request.reallocation_reason && (
        <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Detail label="Mandatory re-allocation reason">
            <span className="whitespace-pre-wrap font-normal">
              {request.reallocation_reason}
            </span>
          </Detail>
          <p className="mt-3 text-xs text-slate-500">
            Previous vehicle:{" "}
            {request.previous_allocated_vehicle?.registration_number || "Not recorded"}
            {" · "}Previous driver:{" "}
            {request.previous_allocated_driver?.full_name || "Not recorded"}
            {" · "}Changed by {request.reallocator?.name || "Assistance Secreatry"}
            {" · "}{formatDateTime(request.reallocated_at)}
          </p>
        </div>
      )}
    </dl>
  );
}
export default function FinalApprovalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const response = await getFinalApprovalVehicleRequest(id);
        setRequest(response?.data?.vehicle_request || false);
      } catch (loadError) {
        setError(
          loadError?.message || "Unable to load final approval details.",
        );
        setRequest(false);
      }
    };
    load();
  }, [id]);
  const approve = async () => {
    setApproving(true);
    try {
      const response = await finalApproveVehicleRequest(id);
      setRequest(response?.data?.vehicle_request || request);
      toast.success(response?.message || "Request approved successfully.");
    } catch (approvalError) {
      toast.error(approvalError?.message || "Unable to approve this request.");
    } finally {
      setApproving(false);
    }
  };
  const reject = async () => {
    if (
      !window.confirm(
        "Reject this vehicle request? The allocated driver and vehicle will be released.",
      )
    ) {
      return;
    }

    setRejecting(true);
    try {
      const response = await finalRejectVehicleRequest(id);
      setRequest(response?.data?.vehicle_request || request);
      toast.success(response?.message || "Request rejected successfully.");
    } catch (rejectionError) {
      toast.error(rejectionError?.message || "Unable to reject this request.");
    } finally {
      setRejecting(false);
    }
  };
  if (request === null)
    return (
      <DashboardLayout>
        <div className="p-8 text-slate-500">Loading request details...</div>
      </DashboardLayout>
    );
  if (request === false)
    return (
      <DashboardLayout>
        <div className="m-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          {error}
        </div>
      </DashboardLayout>
    );
  const attachmentUrl = request.attachment_path
    ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"}/storage/${request.attachment_path}`
    : null;
  const approved = ["approved", "completed"].includes(request.status);
  const rejected = request.status === "rejected";
  const awaitingDecision = request.status === "vehicle_allocated";
  const hasAllocation = Boolean(
    request.allocated_vehicle_id &&
    request.allocated_driver_id &&
    request.allocated_vehicle &&
    request.allocated_driver,
  );
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-5">
        <header className="overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white shadow-lg shadow-blue-900/10">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div>
            <button
              type="button"
              onClick={() => navigate("/pendingfinalapprovals")}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-200 transition hover:text-white"
            >
              <FiArrowLeft />
              Back to pending approvals
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
              Final approval review
            </p>
            <h1 className="mt-0.5 text-xl font-bold sm:text-2xl">
              {requestNumber(request.id)}
            </h1>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
            <button
              type="button"
              onClick={approve}
              disabled={
                approving ||
                rejecting ||
                !awaitingDecision ||
                !hasAllocation
              }
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:bg-slate-500 disabled:opacity-80"
            >
              <FiCheckCircle />
              {approved
                ? "Approved"
                : !hasAllocation
                  ? "Allocation Required"
                  : approving
                    ? "Approving..."
                    : "Approve Request"}
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={approving || rejecting || !awaitingDecision}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-300/40 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:border-white/10 disabled:text-slate-400 disabled:opacity-80"
            >
              <FiXCircle />
              {rejected
                ? "Rejected"
                : rejecting
                  ? "Rejecting..."
                  : "Reject Request"}
            </button>
          </div>
          </div>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <Card title="Request and Journey Information" icon={<FiFileText />} className="lg:col-span-2">
            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Request ID">{requestNumber(request.id)}</Detail>
              <Detail label="Requester">{request.user?.name || request.requester_name}</Detail>
              <Detail label="Department">{request.user?.department}</Detail>
              <Detail label="Employee ID">{request.user?.employee_id}</Detail>
            </div>
            <div className="mt-4 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600"><FiNavigation /> Purpose of trip</p>
              <p className="text-base leading-relaxed text-slate-800">{request.purpose || "No purpose provided."}</p>
            </div>
            <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
              <div className="flex gap-3"><span className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><FiCalendar /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departure</p><p className="mt-1 font-semibold text-slate-800">{formatDateTime(request.departure_at)}</p></div></div>
              <div className="flex gap-3"><span className="rounded-xl bg-amber-100 p-3 text-amber-700"><FiClock /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Expected return</p><p className="mt-1 font-semibold text-slate-800">{formatDateTime(request.expected_return_at)}</p></div></div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Vehicle request route</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><FiMapPin /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Starting location</p><p className="mt-1 break-words font-bold text-slate-900">{displayLocation(request.starting_location, request.starting_latitude, request.starting_longitude, "Starting location not provided")}</p></div></div>
                <div className="flex items-start gap-3"><span className="rounded-xl bg-rose-50 p-3 text-rose-600"><FiMapPin /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ending location</p><p className="mt-1 break-words font-bold text-slate-900">{displayLocation(request.destination, request.destination_latitude, request.destination_longitude, "Ending location not provided")}</p></div></div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Calculated distance</p><p className="mt-1 font-bold text-blue-700">{displayDistance(request.distance_km)}</p></div>
            </div>
            <div className="mt-4 rounded-2xl bg-violet-50 p-4"><Detail label="Passengers">{request.passenger_count}</Detail></div>
          </Card>

          <Card title="Uploaded Files" icon={<FiDownload />}>
            {attachmentUrl ? (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-100"
              >
                <FiDownload />
                {request.attachment_original_name || "Open attachment"}
              </a>
            ) : (
              <p className="text-sm text-slate-500">
                No files were uploaded with this request.
              </p>
            )}
          </Card>

          <Card title="Department Officer Recommendation" icon={<FiShield />}>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Detail label="Officer">{request.recommender?.name}</Detail>
              <Detail label="Recommendation">
                {request.recommendation_status?.replaceAll("_", " ")}
              </Detail>
              <Detail label="Priority">{request.department_priority}</Detail>
              <Detail label="Recommended at">
                {formatDateTime(request.recommended_at)}
              </Detail>
              <div className="sm:col-span-2">
                <Detail label="Remarks">
                  <span className="whitespace-pre-wrap font-normal">
                    {request.recommendation_notes || "No remarks provided."}
                  </span>
                </Detail>
              </div>
            </dl>
          </Card>

          <Card title="Assistance Secreatry Vehicle Allocation" icon={<FiTruck />} className="lg:col-span-2">
            <VehicleAllocationDetails request={request} />
          </Card>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
