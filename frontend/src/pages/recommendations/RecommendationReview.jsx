import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiMapPin,
  FiNavigation,
  FiPaperclip,
  FiTruck,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getDepartmentVehicleRequest,
  submitRecommendation,
} from "../../api/authApi";
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
export default function RecommendationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const loadRequest = async () => {
      try {
        const response = await getDepartmentVehicleRequest(id);
        const vehicleRequest = response?.data?.vehicle_request;
        setRequest(vehicleRequest);
        setPriority(vehicleRequest?.department_priority || "medium");
        setNotes(vehicleRequest?.recommendation_notes || "");
      } catch (error) {
        toast.error(error?.message || "Unable to load this request.");
      }
    };
    loadRequest();
  }, [id]);
  const saveDecision = async (decision) => {
    setSaving(true);
    try {
      const response = await submitRecommendation(id, {
        decision,
        department_priority: priority,
        recommendation_notes: notes,
      });
      setRequest(response?.data?.vehicle_request);
      toast.success(response?.message || "Recommendation saved.");
      navigate("/departmentofficerdashboard");
    } catch (error) {
      const errors = error?.errors;
      toast.error(
        errors
          ? Object.values(errors).flat()[0]
          : error?.message || "Unable to save recommendation.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (!request)
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-500">Loading request…</div>
      </DashboardLayout>
    );
  const reviewed = request.recommendation_status !== "pending";
  const durationMs =
    new Date(request.expected_return_at) - new Date(request.departure_at);
  const durationHours =
    Number.isFinite(durationMs) && durationMs > 0
      ? Math.ceil(durationMs / 3600000)
      : null;
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white shadow-xl shadow-blue-900/10">
          <div className="flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
            <div>
              <button
                onClick={() => navigate("/departmentofficerdashboard")}
                className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-white/20 hover:text-white"
              >
                <FiArrowLeft /> Back to dashboard
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Vehicle request review
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                VMS-REQ-{request.id}
              </h1>
              <p className="mt-3 text-sm text-blue-100">
                Submitted by{" "}
                <span className="font-semibold text-white">
                  {request.user?.name || request.requester_name}
                </span>{" "}
                on {formatDate(request.created_at)}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize ${reviewed ? "border-white/20 bg-white/10 text-white" : "border-amber-300/30 bg-amber-400/20 text-amber-100"}`}
            >
              {reviewed ? <FiCheckCircle /> : <FiClock />}
              {reviewed
                ? request.recommendation_status
                : "Pending recommendation"}
            </span>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Request overview
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Requester
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-semibold">
                    {request.user?.name || request.requester_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Employee ID</p>
                  <p className="font-semibold">
                    {request.user?.employee_id || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-semibold">
                    {request.user?.department || "—"}
                  </p>
                </div>
              </div>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Database record
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Request Record
                </h2>
              </div>
              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-gray-500">Request ID</p>
                  <p className="font-semibold">VMS-REQ-{request.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Workflow Status</p>
                  <p className="font-semibold capitalize">
                    {request.status?.replaceAll("_", " ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted At</p>
                  <p className="font-semibold">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-semibold">
                    {formatDate(request.updated_at)}
                  </p>
                </div>
              </div>
            </section>
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Trip details
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Journey Information
                  </h2>
                </div>
                {durationHours && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                    <FiClock /> {durationHours} hour
                    {durationHours === 1 ? "" : "s"} planned
                  </span>
                )}
              </div>
              <div className="space-y-6 p-6">
                <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-5">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                    <FiNavigation /> Purpose of trip
                  </p>
                  <p className="text-base leading-relaxed text-slate-800">
                    {request.purpose || "No purpose provided."}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
                    <div className="flex gap-3">
                      <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                        <FiCalendar />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Departure
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {formatDate(request.departure_at)}
                        </p>
                      </div>
                    </div>
                    <div className="hidden items-center gap-2 text-slate-300 md:flex">
                      <span className="h-px w-8 bg-slate-300" />
                      <FiArrowRight />
                      <span className="h-px w-8 bg-slate-300" />
                    </div>
                    <div className="flex gap-3 md:justify-end">
                      <span className="rounded-xl bg-amber-100 p-3 text-amber-700">
                        <FiCalendar />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Expected return
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {formatDate(request.expected_return_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
                  <span className="rounded-xl bg-rose-50 p-3 text-rose-600">
                    <FiMapPin />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Destination
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {request.destination || "Destination not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid gap-6 sm:grid-cols-2">
              <section className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-violet-50 p-3 text-violet-600">
                      <FiUsers size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Travel party
                      </p>
                      <h2 className="font-bold text-slate-900">Passengers</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">
                    {request.passenger_count || 0}
                  </span>
                </div>
                <div className="min-h-16 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {request.passenger_names || "No passenger names provided."}
                </div>
              </section>
              <section className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <FiPaperclip size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Supporting document
                    </p>
                    <h2 className="font-bold text-slate-900">Attachment</h2>
                  </div>
                </div>
                {request.attachment_url ? (
                  <a
                    href={request.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    <span className="min-w-0 truncate">
                      {request.attachment_original_name || "View attachment"}
                    </span>
                    <FiArrowRight className="shrink-0" />
                  </a>
                ) : (
                  <div className="flex min-h-16 items-center rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    No attachment provided.
                  </div>
                )}
              </section>
            </div>
            {request.allocated_vehicle && request.allocated_driver && (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <FiTruck size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Confirmed assignment
                    </p>
                    <h2 className="text-xl font-bold text-slate-900">
                      Allocation Details
                    </h2>
                  </div>
                </div>
                <div className="grid gap-5 p-6 text-sm sm:grid-cols-3 [&>div]:rounded-2xl [&>div]:border [&>div]:border-slate-100 [&>div]:bg-slate-50/70 [&>div]:p-4 [&_p:first-child]:text-xs [&_p:first-child]:font-semibold [&_p:first-child]:uppercase [&_p:first-child]:tracking-wide [&_p:first-child]:text-slate-400 [&_p:nth-child(2)]:mt-2 [&_p:nth-child(2)]:text-base [&_p:nth-child(2)]:text-slate-900">
                  <div>
                    <p className="text-gray-500">Vehicle</p>
                    <p className="font-semibold">
                      {[
                        request.allocated_vehicle.make,
                        request.allocated_vehicle.model,
                      ]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {request.allocated_vehicle.registration_number || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Driver</p>
                    <p className="font-semibold">
                      {request.allocated_driver.full_name || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {request.allocated_driver.driver_id || "—"} ·{" "}
                      {request.allocated_driver.contact_number || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Allocated By</p>
                    <p className="font-semibold">
                      {request.allocator?.name || "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(request.allocated_at)}
                    </p>
                  </div>
                </div>
              </section>
            )}
            {request.approved_at && (
              <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
                  <FiCheckCircle />
                  Final Approval
                </h2>
                <div className="grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-emerald-700">Approved By</p>
                    <p className="font-semibold">
                      {request.approver?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-700">Approved At</p>
                    <p className="font-semibold">
                      {formatDate(request.approved_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-700">Driver Notified</p>
                    <p className="font-semibold">
                      {formatDate(request.driver_notified_at)}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-6">
            {!reviewed ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                  Officer Recommendation
                </h2>
                <label className="mb-2 block text-sm font-medium">
                  Department Priority
                </label>
                <select
                  value={priority}
                  disabled={saving}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <label className="mb-2 mt-4 block text-sm font-medium">
                  Recommendation Notes
                </label>
                <textarea
                  value={notes}
                  disabled={saving}
                  onChange={(event) => setNotes(event.target.value)}
                  rows="6"
                  className="w-full rounded-lg border p-3"
                  placeholder="Add recommendation notes..."
                />
                <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  Your decision is recorded with your account and cannot be
                  changed from this screen.
                </p>
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveDecision("recommended")}
                    className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Recommend For Allocation"}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveDecision("rejected")}
                    className="w-full rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Reject Request
                  </button>
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                <div
                  className={`border-b p-6 ${request.recommendation_status === "recommended" ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-xl p-3 ${request.recommendation_status === "recommended" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {request.recommendation_status === "recommended" ? (
                        <FiCheckCircle size={20} />
                      ) : (
                        <FiXCircle size={20} />
                      )}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {request.recommendation_status === "recommended"
                          ? "Recommended Details"
                          : "Rejection Details"}
                      </h2>
                      <p
                        className={`text-sm font-semibold capitalize ${request.recommendation_status === "recommended" ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {request.recommendation_status}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex gap-3">
                    <FiUser className="mt-1 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Reviewed by
                      </p>
                      <p className="font-semibold text-slate-800">
                        {request.recommender?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.recommender?.employee_id || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FiCalendar className="mt-1 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Decision date
                      </p>
                      <p className="font-semibold text-slate-800">
                        {formatDate(request.recommended_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FiFlag className="mt-1 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Department priority
                      </p>
                      <p className="font-semibold capitalize text-slate-800">
                        {request.department_priority || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                      Recommendation notes
                    </p>
                    <div className="whitespace-pre-line rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                      {request.recommendation_notes ||
                        "No recommendation notes provided."}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
