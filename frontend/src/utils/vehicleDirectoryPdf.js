const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const text = (value) => escapeHtml(value === "" || value == null ? "-" : value);
const valueWithUnit = (value, unit) =>
  value === "—" || value === "-" || value == null ? "-" : `${text(value)} ${unit}`;

export function generateVehicleDirectoryPdf(vehicles) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    throw new Error("There are no vehicles to export.");
  }

  const generatedAt = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
  const perPage = 9;
  const pages = Array.from(
    { length: Math.ceil(vehicles.length / perPage) },
    (_, index) => vehicles.slice(index * perPage, (index + 1) * perPage),
  );
  const count = (status) => vehicles.filter((vehicle) => vehicle.status === status).length;
  const masthead = `<div class="masthead"><div class="brand">Vehicle Management System</div><div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div></div>`;
  const sheets = pages
    .map(
      (items, pageIndex) => `<section class="sheet">${masthead}
        <div class="title"><div><h1>Total Vehicle Report</h1><p>Official fleet inventory and operational status report</p></div><span class="badge">FLEET REPORT</span></div>
        ${
          pageIndex === 0
            ? `<div class="summary"><div><span>VEHICLES</span><strong>${vehicles.length}</strong></div><div><span>AVAILABLE</span><strong>${count("Available")}</strong></div><div><span>UNAVAILABLE</span><strong>${count("Unavailable")}</strong></div><div><span>MAINTENANCE</span><strong>${count("Maintenance")}</strong></div></div>`
            : ""
        }
        <h2>Fleet Inventory</h2>
        <table><thead><tr><th>No.</th><th>Vehicle</th><th>Registration</th><th>Type</th><th>Fuel</th><th>Capacity / Level</th><th>Seats</th><th>Licence Expiry</th><th>Status</th></tr></thead>
        <tbody>${items
          .map(
            (vehicle, rowIndex) => `<tr><td>${pageIndex * perPage + rowIndex + 1}</td><td><strong>${text(vehicle.model)}</strong><small>${text(vehicle.id)}</small></td><td>${text(vehicle.registerNo)}</td><td>${text(vehicle.type)}</td><td>${text(vehicle.fuel)}</td><td>${valueWithUnit(vehicle.fuelCapacity, "L")}<small>Level: ${valueWithUnit(vehicle.fuelLevel, "%")}</small></td><td>${text(vehicle.seatCapacity)}</td><td>${text(vehicle.licenseExpiry)}</td><td>${text(vehicle.status)}</td></tr>`,
          )
          .join("")}</tbody></table>
        ${pageIndex === pages.length - 1 ? `<div class="reference"><strong>Document Reference</strong>Total Vehicle Report &nbsp;|&nbsp; ${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"} &nbsp;|&nbsp; Generated ${escapeHtml(generatedAt)}</div>` : ""}
        <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page ${pageIndex + 1} of ${pages.length}</span></div>
      </section>`,
    )
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  printWindow.opener = null;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Total Vehicle Report</title><style>
    @page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#eef1f5;color:#172033;font-family:Arial,sans-serif}.sheet{position:relative;width:297mm;height:209mm;margin:0 auto 8mm;padding:38mm 12mm 18mm;background:#fff;page-break-after:always;overflow:hidden}.sheet:last-child{page-break-after:auto}.masthead{position:absolute;inset:0 0 auto;display:flex;height:28mm;flex-direction:column;align-items:center;justify-content:center;border-bottom:2mm solid #2c79c7;background:#0b2f5b;color:#fff}.brand{font-size:18pt;font-weight:700}.sub{margin-top:2mm;color:#d6e7f7;font-size:8.5pt}.title{display:flex;align-items:center;justify-content:space-between;margin-bottom:4mm}h1{margin:0;font-size:20pt}.title p{margin:1.5mm 0 0;color:#647084;font-size:8.5pt}.badge{border-radius:20px;background:#e8f3ff;color:#1558a6;padding:3mm 6mm;font-size:7.5pt;font-weight:700}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-bottom:4mm}.summary div{border:.2mm solid #d6e0ea;border-radius:2mm;background:#f8fafc;padding:2.5mm 3mm}.summary span{display:block;color:#647084;font-size:6pt;font-weight:700}.summary strong{display:block;margin-top:1mm;color:#0b2f5b;font-size:11pt}h2{margin:0 0 2mm;border-left:1.4mm solid #1558a6;padding:1mm 0 1mm 3mm;color:#0b2f5b;font-size:10pt;text-transform:uppercase}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7pt}tr{break-inside:avoid}th{background:#0b2f5b;color:#fff;padding:2.2mm 1.5mm;text-align:left;font-size:5.8pt;text-transform:uppercase}th:first-child{width:5%}th:nth-child(2){width:18%}th:nth-child(3){width:13%}th:nth-child(6){width:14%}td{border:.2mm solid #d6e0ea;padding:2.4mm 1.5mm;overflow-wrap:anywhere}tbody tr:nth-child(even){background:#f8fafc}td strong,td small{display:block}td small{margin-top:1mm;color:#647084;font-size:6pt}.reference{margin-top:4mm;border-radius:2mm;background:#edf5fd;padding:3mm;color:#647084;font-size:7pt}.reference strong{display:block;margin-bottom:1mm;color:#0b2f5b}.footer{position:absolute;right:12mm;bottom:6mm;left:12mm;display:flex;justify-content:space-between;border-top:.2mm solid #d6e0ea;padding-top:2.5mm;color:#647084;font-size:7pt}@media screen{.sheet{box-shadow:0 8px 30px rgba(15,23,42,.16)}}@media print{html,body{background:#fff}.sheet{margin:0;box-shadow:none}}
  </style></head><body>${sheets}<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),250));</script></body></html>`);
  printWindow.document.close();
}
