import { useEffect, useState } from "react";
import { FiAlertTriangle, FiClock, FiTruck, FiUser } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getVehicleIssueReports } from "../../api/authApi";
import { formatLocalDateTime as dateTime } from "../../utils/dateTime";

const label = (value) => value?.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Not recorded";

export default function OnTimeAvailability() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVehicleIssueReports()
      .then((response) => setReports(response?.data?.reports || []))
      .catch((requestError) => setError(requestError?.message || "Unable to load issue reports."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-slate-900">Driver Issue Reports</h1><p className="mt-1 text-slate-500">Vehicle problems and journey delays reported by drivers.</p></div>
        {loading && <p className="rounded-2xl border bg-white p-10 text-center text-slate-500">Loading reports...</p>}
        {error && <p className="rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</p>}
        {!loading && !error && reports.length === 0 && <p className="rounded-2xl border bg-white p-10 text-center text-slate-500">No driver issues have been reported.</p>}

        <div className="grid gap-5 xl:grid-cols-2">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                <div className="flex gap-3"><span className="rounded-xl bg-amber-50 p-3 text-amber-600"><FiAlertTriangle /></span><div><h2 className="font-bold text-slate-900">{label(report.issue_type)}</h2><p className="text-sm text-slate-500">Reported {dateTime(report.reported_at)}</p></div></div>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold capitalize text-red-700">{report.status}</span>
              </div>

              {report.details && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{report.details}</p>}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <section><h3 className="flex items-center gap-2 font-bold text-blue-800"><FiUser /> Driver</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-slate-500">Name / ID</dt><dd className="font-semibold">{report.driver?.full_name} ({report.driver?.driver_id})</dd></div><div><dt className="text-slate-500">NIC</dt><dd>{report.driver?.nic}</dd></div><div><dt className="text-slate-500">Contact</dt><dd>{report.driver?.contact_number}</dd></div><div><dt className="text-slate-500">Licence</dt><dd>{report.driver?.licence_number} - {report.driver?.licence_type}</dd></div></dl></section>
                <section><h3 className="flex items-center gap-2 font-bold text-blue-800"><FiTruck /> Vehicle</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-slate-500">Vehicle</dt><dd className="font-semibold">{report.vehicle ? `${report.vehicle.make} ${report.vehicle.model}` : "Not linked"}</dd></div><div><dt className="text-slate-500">Registration</dt><dd>{report.vehicle?.registration_number || "Not linked"}</dd></div><div><dt className="text-slate-500">Type / Status</dt><dd>{report.vehicle ? `${report.vehicle.vehicle_type} / ${label(report.vehicle.status)}` : "Not linked"}</dd></div></dl></section>
              </div>
              <section className="mt-5 border-t pt-4"><h3 className="flex items-center gap-2 font-bold text-blue-800"><FiClock /> Journey</h3>{report.journey ? <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2"><div><dt className="text-slate-500">Request / Purpose</dt><dd>REQ-{String(report.journey.id).padStart(4, "0")} - {report.journey.purpose}</dd></div><div><dt className="text-slate-500">Destination</dt><dd>{report.journey.destination}</dd></div><div><dt className="text-slate-500">Scheduled Departure</dt><dd>{dateTime(report.journey.departure_at)}</dd></div><div><dt className="text-slate-500">Expected Return</dt><dd>{dateTime(report.journey.expected_return_at)}</dd></div></dl> : <p className="mt-2 text-sm text-slate-500">No active or upcoming journey was linked.</p>}</section>
            </article>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
