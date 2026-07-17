import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  finalApproveVehicleRequest,
  getFinalApprovalVehicleRequest,
} from "../../api/authApi";
const requestNumber = (id) => `REQ-${String(id).padStart(4, "0")}`;
const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "—";
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
function Card({ title, icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <span className="rounded-xl bg-blue-50 p-3 text-blue-600">{icon}</span>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
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
        No vehicle allocation is stored for this request. The Deputy Secretary
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
      <Detail label="Vehicle database ID">{vehicle.id}</Detail>
      <Detail label="Driver's name">{driver.full_name}</Detail>
      <Detail label="Contact number">{driver.contact_number}</Detail>
      <Detail label="Driver ID number">{driver.driver_id}</Detail>
      <Detail label="NIC number">{driver.nic}</Detail>
      <Detail label="Allocated by">{allocator?.name}</Detail>
      <Detail label="Allocator employee ID">{allocator?.employee_id}</Detail>
      <Detail label="Allocated at">
        {formatDateTime(request.allocated_at)}
      </Detail>
      <Detail label="Driver notified at">
        {formatDateTime(request.driver_notified_at)}
      </Detail>
      <Detail label="Request status">
        <span className="capitalize">
          {request.status?.replaceAll("_", " ")}
        </span>
      </Detail>
    </dl>
  );
}
export default function FinalApprovalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);
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
  const approved = request.status === "approved";
  const hasAllocation = Boolean(
    request.allocated_vehicle_id &&
    request.allocated_driver_id &&
    request.allocated_vehicle &&
    request.allocated_driver,
  );
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 bg-slate-50 p-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              type="button"
              onClick={() => navigate("/pendingfinalapprovals")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
            >
              <FiArrowLeft />
              Back to pending approvals
            </button>
            <p className="text-sm font-semibold text-blue-600">
              Final approval review
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {requestNumber(request.id)}
            </h1>
          </div>
          <button
            type="button"
            onClick={approve}
            disabled={approving || approved || !hasAllocation}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:opacity-80"
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
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Request and Journey" icon={<FiFileText />}>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Detail label="Request ID">{requestNumber(request.id)}</Detail>
              <Detail label="Requester">
                {request.user?.name || request.requester_name}
              </Detail>
              <Detail label="Department">{request.user?.department}</Detail>
              <Detail label="Employee ID">{request.user?.employee_id}</Detail>
              <Detail label="Journey">{request.destination}</Detail>
              <Detail label="Purpose">{request.purpose}</Detail>
              <Detail label="Departure time">
                {formatDateTime(request.departure_at)}
              </Detail>
              <Detail label="Expected return">
                {formatDateTime(request.expected_return_at)}
              </Detail>
              <Detail label="Passengers">{request.passenger_count}</Detail>
            </dl>
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

          <Card title="Department Officer Recommendation" icon={<FiUser />}>
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

          <Card title="Deputy Secretary Vehicle Allocation" icon={<FiTruck />}>
            <VehicleAllocationDetails request={request} />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
