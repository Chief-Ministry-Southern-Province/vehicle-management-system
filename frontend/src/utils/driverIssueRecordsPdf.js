import { formatLocalDateTime } from "./dateTime";

const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const text = (value) => escapeHtml(value || "-");
const dateTime = (value) => escapeHtml(formatLocalDateTime(value, "-"));
const label = (value) => text(value ? String(value).replaceAll("_", " ") : "Not recorded");
const field = (name, value) => `<div class="field"><span>${escapeHtml(name)}</span><strong>${value}</strong></div>`;
const section = (title, fields) => `<section><h2>${escapeHtml(title)}</h2><div class="grid">${fields.join("")}</div></section>`;

export function generateDriverIssueRecordsPdf(reports) {
  if (!Array.isArray(reports) || reports.length === 0) {
    throw new Error("Select at least one driver issue record to export.");
  }

  const generatedAt = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());

  const sheets = reports.map((report, index) => {
    const driver = report.driver || {};
    const vehicle = report.vehicle || {};
    const journey = report.journey || {};
    const issueId = `ISS-${String(report.id).padStart(4, "0")}`;
    const requestId = journey.id ? `REQ-${String(journey.id).padStart(4, "0")}` : "-";
    return `<div class="sheet">
      <div class="masthead"><div class="brand">Vehicle Management System</div><div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div></div>
      <div class="title"><div><h1>Driver Issue Record</h1><p>${issueId} &nbsp;|&nbsp; Official vehicle and journey incident report</p></div><span class="badge">${label(report.status)}</span></div>
      ${section("Issue Information", [field("Issue reference", text(issueId)), field("Report status", label(report.status)), field("Issue type", label(report.issue_type)), field("Reported at", dateTime(report.reported_at)), field("Driver status", label(journey.journey_status)), field("Issue details", text(report.details))])}
      ${section("Driver Information", [field("Driver name", text(driver.full_name)), field("Driver ID", text(driver.driver_id)), field("NIC", text(driver.nic)), field("Contact number", text(driver.contact_number)), field("Licence number", text(driver.licence_number)), field("Licence type", text(driver.licence_type))])}
      ${section("Vehicle Information", [field("Registration number", text(vehicle.registration_number)), field("Vehicle", text([vehicle.make, vehicle.model].filter(Boolean).join(" "))), field("Vehicle type", text(vehicle.vehicle_type)), field("Vehicle status", label(vehicle.status))])}
      ${section("Journey Information", [field("Request number", text(requestId)), field("Request status", label(journey.status)), field("Purpose", text(journey.purpose)), field("Destination", text(journey.destination)), field("Scheduled departure", dateTime(journey.departure_at)), field("Expected return", dateTime(journey.expected_return_at))])}
      <div class="reference"><strong>Document Reference</strong>Driver Issue Record &nbsp;|&nbsp; ${issueId} &nbsp;|&nbsp; Generated ${escapeHtml(generatedAt)} by the Vehicle Management System</div>
      <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page ${index + 1} of ${reports.length}</span></div>
    </div>`;
  }).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  printWindow.opener = null;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Driver Issue Records</title><style>
    @page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#eef1f5;color:#172033;font-family:Arial,sans-serif}
    .sheet{position:relative;width:210mm;height:296mm;margin:0 auto 8mm;padding:45mm 16mm 18mm;background:#fff;page-break-after:always;break-after:page;overflow:hidden}.sheet:last-child{page-break-after:auto;break-after:auto}
    .masthead{position:absolute;top:0;left:0;right:0;display:flex;height:34mm;flex-direction:column;align-items:center;justify-content:center;border-bottom:2.2mm solid #2c79c7;background:#0b2f5b;color:#fff;text-align:center}.brand{font-size:18pt;font-weight:700;line-height:1}.sub{margin-top:3mm;color:#d6e7f7;font-size:8.8pt}
    .title{display:flex;justify-content:space-between;align-items:center;margin-bottom:5mm}h1{margin:0;font-size:20pt}.title p{margin:1.5mm 0 0;color:#647084;font-size:8.5pt}.badge{border-radius:20px;background:#fff1e6;color:#b45309;padding:2.4mm 5mm;font-size:7.5pt;font-weight:700;text-transform:uppercase}
    section{margin-bottom:3.2mm;break-inside:avoid}h2{margin:0 0 1.5mm;border-left:1.4mm solid #1558a6;padding:1.1mm 0 1.1mm 2.5mm;color:#0b2f5b;font-size:10pt;text-transform:uppercase}.grid{display:grid;grid-template-columns:1fr 1fr;border:.2mm solid #d6e0ea;border-bottom:0}
    .field{min-height:10mm;padding:1.8mm 2.5mm;border-bottom:.2mm solid #d6e0ea}.field:nth-child(4n+3),.field:nth-child(4n+4){background:#f8fafc}.field:nth-child(odd){border-right:.2mm solid #d6e0ea}.field span{display:block;margin-bottom:.8mm;color:#647084;font-size:6pt;font-weight:700;text-transform:uppercase;letter-spacing:.3px}.field strong{display:block;white-space:pre-wrap;overflow-wrap:anywhere;font-size:7.8pt;line-height:1.2}
    .reference{margin-top:3mm;border-radius:2mm;background:#edf5fd;padding:3mm;color:#647084;font-size:7pt}.reference strong{display:block;margin-bottom:1mm;color:#0b2f5b;font-size:7.7pt}.footer{position:absolute;right:16mm;bottom:6mm;left:16mm;display:flex;justify-content:space-between;border-top:.2mm solid #d6e0ea;padding-top:3mm;color:#647084;font-size:7.2pt}
    @media screen{.sheet{box-shadow:0 8px 30px rgba(15,23,42,.16)}}@media print{html,body{background:#fff}.sheet{width:210mm;height:296mm;margin:0;box-shadow:none;page-break-inside:avoid;break-inside:avoid}}
  </style></head><body>${sheets}<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});</script></body></html>`);
  printWindow.document.close();
}
