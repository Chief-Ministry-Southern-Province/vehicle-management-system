import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiDownload,
  FiFileText,
  FiMapPin,
  FiXCircle,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  cancelMyVehicleRequest,
  getMyVehicleRequest,
} from "../../api/authApi";
import { formatLocalDateTime as formatDateTime } from "../../utils/dateTime";
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const statusStyles = {
  submitted: "bg-amber-100 text-amber-700",
  recommended: "bg-blue-100 text-blue-700",
  vehicle_allocated: "bg-indigo-100 text-indigo-700",
  approved: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-slate-200 text-slate-700",
  rejected: "bg-rose-100 text-rose-700",
};
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

function savedLocation(label, latitude, longitude) {
  if (typeof label === "string" && label.trim()) return label.trim();
  const lat = Number(latitude);
  const lng = Number(longitude);
  return latitude != null && longitude != null && Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    : "Unavailable for this request";
}

function savedDistance(distance) {
  if (distance == null || distance === "") return "Unavailable for this request";
  const numericDistance = Number(distance);
  return Number.isFinite(numericDistance)
    ? `${numericDistance.toFixed(2)} km`
    : "Unavailable for this request";
}
function Timeline({ request }) {
  const steps = [
    {
      title: "Submitted Request",
      description: "Submitted by the employee",
      completed: true,
      date: request.created_at,
    },
    {
      title: "Department Officer Recommendation",
      description: request.recommender
        ? `Recommended by ${request.recommender.name}`
        : "Awaiting Department Officer recommendation",
      completed: Boolean(request.recommended_at),
      date: request.recommended_at,
    },
    {
      title: "Assistance Secreatry Allocated Vehicle and Driver",
      description: request.allocated_at
        ? "Vehicle and driver allocation completed"
        : "Awaiting vehicle and driver allocation",
      completed: Boolean(request.allocated_at),
      date: request.allocated_at,
    },
    {
      title: "Senior Assistance Secretary or Secretary Approval",
      description: request.approver
        ? `Approved by ${request.approver.name}`
        : "Awaiting final approval",
      completed: ["approved", "completed"].includes(request.status),
      date: request.approved_at,
    },
    {
      title: "Complete Journey",
      description:
        request.status === "completed"
          ? "Journey completed by the driver"
          : request.status === "cancelled"
            ? "Request cancelled before journey completion"
            : "Awaiting journey completion by the driver",
      completed: request.status === "completed",
      cancelled: request.status === "cancelled",
      date: request.journey_completed_at || request.cancelled_at,
    },
  ];
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
          {index < steps.length - 1 && (
            <span
              className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${step.completed ? "bg-blue-300" : "bg-slate-200"}`}
            />
          )}
          <span
            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.cancelled ? "bg-slate-600 text-white" : step.completed ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
          >
            {step.cancelled ? <FiXCircle /> : step.completed ? <FiCheck /> : <FiClock />}
          </span>
          <div>
            <p
              className={`font-semibold ${step.completed ? "text-slate-900" : "text-slate-500"}`}
            >
              Step {index + 1} — {step.title}
            </p>
            <p className="mt-1 text-sm text-slate-500">{step.description}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {formatDateTime(step.date)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export default function EmployeeRequestDetails({
  historyPath = "/requesthistory",
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  useEffect(() => {
    const loadRequest = async () => {
      try {
        const response = await getMyVehicleRequest(id);
        setRequest(response?.data?.vehicle_request || false);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load request details.");
        setRequest(false);
      }
    };
    loadRequest();
  }, [id]);
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
  const approved = ["approved", "completed"].includes(request.status);
  const reallocated = Boolean(request.reallocated_at);
  const canCancel = ["submitted", "recommended", "vehicle_allocated", "approved"].includes(
    request.status,
  );
  const vehicle = approved || reallocated ? request.allocated_vehicle : null;
  const driver = approved || reallocated ? request.allocated_driver : null;
  const attachmentUrl = request.attachment_path
    ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"}/storage/${request.attachment_path}`
    : null;
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <button
                type="button"
                onClick={() => navigate(historyPath)}
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
              >
                <FiArrowLeft />
                Back to request history
              </button>
              <p className="text-sm text-slate-500">
                {requestNumber(request.id)}
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {request.purpose}
              </h1>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyles[request.status] || "bg-slate-100 text-slate-700"}`}
              >
                {request.status?.replaceAll("_", " ")}
              </span>
            </div>
            {canCancel && (
              <button
                type="button"
                disabled={cancelling}
                onClick={async () => {
                  if (!window.confirm("Cancel this vehicle request? This action cannot be undone.")) return;
                  setCancelling(true);
                  setError("");
                  try {
                    const response = await cancelMyVehicleRequest(request.id);
                    setRequest(response?.data?.vehicle_request || {
                      ...request,
                      status: "cancelled",
                    });
                  } catch (cancelError) {
                    setError(cancelError?.message || "Unable to cancel this request.");
                  } finally {
                    setCancelling(false);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiXCircle />
                {cancelling ? "Cancelling..." : "Cancel Request"}
              </button>
            )}
          </header>
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-12">
            <main className="space-y-6 lg:col-span-8">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Request Details
                  </h2>
                </div>
                <dl className="grid gap-6 p-6 sm:grid-cols-2">
                  <Detail label="Request ID">
                    {requestNumber(request.id)}
                  </Detail>
                  <Detail label="Submission date">
                    {formatDateTime(request.created_at)}
                  </Detail>
                  <Detail label="Requester">
                    {request.user?.name || request.requester_name}
                  </Detail>
                  <Detail label="Department">{request.user?.department}</Detail>
                  <Detail label="Passengers">{request.passenger_count}</Detail>
                  <Detail label="Purpose">{request.purpose}</Detail>
                  <Detail label="Departure time">
                    {formatDateTime(request.departure_at)}
                  </Detail>
                  <Detail label="Expected return">
                    {formatDateTime(request.expected_return_at)}
                  </Detail>
                  {request.consolidated_journey?.request_count > 1 && (
                    <div className="sm:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="font-semibold text-blue-900">
                        Consolidated journey covering {request.consolidated_journey.request_count} requests
                      </p>
                      <p className="mt-2 text-sm text-blue-800">
                        Combined trip time: {formatDateTime(request.consolidated_journey.departure_at)} to {formatDateTime(request.consolidated_journey.expected_return_at)}
                      </p>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Detail label="Starting location">
                      <span className="inline-flex items-center gap-2">
                        <FiMapPin className="text-emerald-600" />
                        {savedLocation(
                          request.starting_location,
                          request.starting_latitude,
                          request.starting_longitude,
                        )}
                      </span>
                    </Detail>
                  </div>
                  <div className="sm:col-span-2">
                    <Detail label="Ending location">
                      <span className="inline-flex items-center gap-2">
                        <FiMapPin className="text-red-500" />
                        {savedLocation(
                          request.destination,
                          request.destination_latitude,
                          request.destination_longitude,
                        )}
                      </span>
                    </Detail>
                  </div>
                  <Detail label="Calculated distance">
                    {savedDistance(request.distance_km)}
                  </Detail>
                </dl>
              </section>

              {approved || reallocated ? (
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                      <FiTruck />
                    </span>
                    <div>
                      <h2 className="font-bold text-slate-900">
                        {approved
                          ? "Approved Vehicle and Driver"
                          : "Re-allocated Vehicle and Driver"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {approved
                          ? "Current approved allocation"
                          : "This change is awaiting fresh final approval"}
                      </p>
                    </div>
                  </div>
                  <dl className="grid gap-5 rounded-xl bg-white p-5 sm:grid-cols-2">
                    <Detail label="Vehicle">
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : "—"}
                    </Detail>
                    <Detail label="Registration number">
                      {vehicle?.registration_number}
                    </Detail>
                    <Detail label="Vehicle type">
                      {vehicle?.vehicle_type}
                    </Detail>
                    <Detail label="Driver">{driver?.full_name}</Detail>
                    <Detail label="Driver ID">{driver?.driver_id}</Detail>
                    <Detail label="Contact number">
                      {driver?.contact_number}
                    </Detail>
                    {request.reallocation_reason && (
                      <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <Detail label="Reason for vehicle re-allocation">
                          <span className="whitespace-pre-wrap font-normal">
                            {request.reallocation_reason}
                          </span>
                        </Detail>
                        <p className="mt-2 text-xs text-slate-500">
                          Previous vehicle:{" "}
                          {request.previous_allocated_vehicle
                            ?.registration_number || "Not recorded"}
                          {" · "}Previous driver:{" "}
                          {request.previous_allocated_driver?.full_name ||
                            "Not recorded"}
                          {" · "}Changed {formatDateTime(request.reallocated_at)}
                        </p>
                      </div>
                    )}
                  </dl>
                </section>
              ) : request.status !== "cancelled" ? (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                  <div className="flex gap-3">
                    <FiClock className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                      <h2 className="font-semibold text-amber-900">
                        Vehicle details are pending final approval
                      </h2>
                      <p className="mt-1 text-sm text-amber-800">
                        The allocated vehicle and driver will be displayed only
                        after the Senior Assistance Secretary or Secretary approves
                        this request.
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <FiFileText />
                  Request Attachment
                </h2>
                {attachmentUrl ? (
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700"
                  >
                    <FiDownload />
                    {request.attachment_original_name || "Open attachment"}
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">
                    No attachment uploaded.
                  </p>
                )}
              </section>
            </main>
            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 font-bold text-slate-900">
                  Request Timeline
                </h2>
                <Timeline request={request} />
              </section>
              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                  <FiUser />
                  Need assistance?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Contact the transport office if changes are required.
                </p>
                <p>Contact: 0768240143</p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
