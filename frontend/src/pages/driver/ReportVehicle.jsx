import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiSend, FiTruck } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { createVehicleIssueReport, getDriverScheduledJourneys } from "../../api/authApi";

const issueOptions = [
  ["vehicle_breakdown", "Vehicle breakdown"],
  ["mechanical_issue", "Mechanical issue"],
  ["tyre_issue", "Tyre issue"],
  ["fuel_issue", "Fuel issue"],
  ["accident", "Accident"],
  ["journey_delay", "Journey delay"],
  ["cannot_complete_journey", "Cannot complete journey on time"],
  ["other", "Other issue"],
];

export default function ReportVehicle() {
  const [searchParams] = useSearchParams();
  const [journeys, setJourneys] = useState([]);
  const [form, setForm] = useState({ vehicle_request_id: searchParams.get("journey") || "", issue_type: "", details: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDriverScheduledJourneys()
      .then((response) => setJourneys(response?.data?.trips || []))
      .catch(() => setJourneys([]));
  }, []);

  const journey = journeys.find((item) => String(item.id) === String(form.vehicle_request_id));
  const vehicle = journey?.vehicle;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createVehicleIssueReport(form);
      toast.success("Issue reported successfully.");
      setForm((current) => ({ ...current, issue_type: "", details: "" }));
    } catch (error) {
      toast.error(error?.message || "Unable to submit the issue report.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><h1 className="text-3xl font-bold text-slate-900">Report an Issue</h1><p className="mt-1 text-slate-500">Quickly notify officers about a vehicle problem or journey delay.</p></div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b pb-5">
            <span className="rounded-xl bg-amber-50 p-3 text-amber-600"><FiAlertTriangle size={22} /></span>
            <div><h2 className="font-bold text-slate-900">New Issue Report</h2><p className="text-sm text-slate-500">Select the issue and submit. Additional details are optional.</p></div>
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex items-center gap-2 font-semibold"><FiTruck /> Journey Vehicle</div>
            <p className="mt-1">{vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.registration_number}` : "Select a journey to identify its allocated vehicle."}</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">Journey
              <select required value={form.vehicle_request_id} onChange={(event) => setForm((current) => ({ ...current, vehicle_request_id: event.target.value }))} className={field}>
                <option value="" disabled>Select a journey</option>
                {journeys.map((item) => <option key={item.id} value={item.id}>{item.reference} — {item.destination} ({item.vehicle?.registration_number || "No vehicle"})</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Issue Type
              <select required value={form.issue_type} onChange={(event) => setForm((current) => ({ ...current, issue_type: event.target.value }))} className={field}>
                <option value="" disabled>Select an issue</option>
                {issueOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Additional Details (Optional)
              <textarea rows={4} maxLength={1000} value={form.details} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} placeholder="Add a short note if needed" className={field} />
            </label>
            <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><FiSend />{submitting ? "Submitting..." : "Submit Report"}</button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
