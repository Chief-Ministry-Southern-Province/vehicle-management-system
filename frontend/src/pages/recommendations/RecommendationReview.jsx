import { FiArrowLeft, FiMapPin, FiPaperclip, FiUsers } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDepartmentVehicleRequest, submitRecommendation } from "../../api/authApi";

const formatDate = (value) => value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—";

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
      const response = await submitRecommendation(id, { decision, department_priority: priority, recommendation_notes: notes });
      setRequest(response?.data?.vehicle_request);
      toast.success(response?.message || "Recommendation saved.");
      navigate("/departmentofficerdashboard");
    } catch (error) {
      const errors = error?.errors;
      toast.error(errors ? Object.values(errors).flat()[0] : error?.message || "Unable to save recommendation.");
    } finally {
      setSaving(false);
    }
  };

  if (!request) return <DashboardLayout><div className="p-6 text-gray-500">Loading request…</div></DashboardLayout>;
  const reviewed = request.recommendation_status !== "pending";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <button onClick={() => navigate("/departmentofficerdashboard")} className="flex items-center gap-2 text-gray-500 text-sm mb-2 hover:text-blue-600"><FiArrowLeft />View Dashboard</button>
            <h1 className="text-3xl font-bold">Review Request: VMS-REQ-{request.id}</h1>
            <p className="mt-1 text-gray-500">Submitted by {request.user?.name || request.requester_name} on {formatDate(request.created_at)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${reviewed ? "bg-slate-100 text-slate-700" : "bg-yellow-100 text-yellow-700"}`}>{reviewed ? request.recommendation_status : "Pending Recommendation"}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Requester</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm"><div><p className="text-gray-500">Name</p><p className="font-semibold">{request.user?.name || request.requester_name}</p></div><div><p className="text-gray-500">Employee ID</p><p className="font-semibold">{request.user?.employee_id || "—"}</p></div><div><p className="text-gray-500">Department</p><p className="font-semibold">{request.user?.department || "—"}</p></div></div>
            </section>
            <section className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Journey Information</h2>
              <div className="space-y-5"><div><p className="font-medium flex items-center gap-2 mb-2"><FiMapPin className="text-blue-600" />Purpose of Trip</p><div className="bg-gray-50 border rounded-lg p-4">{request.purpose}</div></div><div className="grid sm:grid-cols-2 gap-4"><div className="border rounded-lg p-4"><p className="text-xs text-gray-500">DESTINATION</p><p className="font-semibold">{request.destination}</p></div><div className="border rounded-lg p-4"><p className="text-xs text-gray-500">DEPARTURE</p><p className="font-semibold">{formatDate(request.departure_at)}</p><p className="mt-2 text-xs text-gray-500">EXPECTED RETURN</p><p className="font-semibold">{formatDate(request.expected_return_at)}</p></div></div></div>
            </section>
            <div className="grid sm:grid-cols-2 gap-6"><section className="bg-white border rounded-xl p-6"><h2 className="font-semibold flex items-center gap-2 mb-4"><FiUsers />Passengers ({request.passenger_count})</h2><p className="text-gray-700 whitespace-pre-line">{request.passenger_names || "No passenger names provided."}</p></section><section className="bg-white border rounded-xl p-6"><h2 className="font-semibold flex items-center gap-2 mb-4"><FiPaperclip />Attachment</h2><p className="text-gray-700">{request.attachment_original_name || "No attachment provided."}</p></section></div>
          </div>
          <aside className="space-y-6"><section className="bg-white border rounded-xl p-6"><h2 className="text-lg font-bold text-slate-800 mb-4">Officer Recommendation</h2><label className="block mb-2 text-sm font-medium">Department Priority</label><select value={priority} disabled={reviewed || saving} onChange={(event) => setPriority(event.target.value)} className="w-full border rounded-lg p-3"><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><label className="block mt-4 mb-2 text-sm font-medium">Recommendation Notes</label><textarea value={notes} disabled={reviewed || saving} onChange={(event) => setNotes(event.target.value)} rows="6" className="w-full border rounded-lg p-3" placeholder="Add recommendation notes..." /><p className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg mt-4">Your decision is recorded with your account and cannot be changed from this screen.</p>{!reviewed && <div className="mt-4 space-y-3"><button type="button" disabled={saving} onClick={() => saveDecision("recommended")} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-medium">{saving ? "Saving..." : "Recommend For Allocation"}</button><button type="button" disabled={saving} onClick={() => saveDecision("rejected")} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-lg font-medium">Reject Request</button></div>}</section></aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
