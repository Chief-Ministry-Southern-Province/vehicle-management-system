const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const money = (value) =>
  Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const date = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value || "-"
    : new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: "Asia/Colombo",
      }).format(parsed);
};

export function generateRepairRecordsPdf(records, { recordKind = "Repair" } = {}) {
  const kind = escapeHtml(recordKind);
  const kindLower = recordKind.toLowerCase();
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error(`Select at least one ${kindLower} record to export.`);
  }

  const totalCost = records.reduce(
    (total, record) => total + (Number(record.cost) || 0),
    0,
  );
  const generatedAt = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
  // Both repair and service reports include summary cards on page one.
  // Twelve rows keeps the table and footer within one landscape A4 sheet.
  const recordsPerPage = 12;
  const pages = Array.from(
    { length: Math.ceil(records.length / recordsPerPage) },
    (_, index) => records.slice(index * recordsPerPage, (index + 1) * recordsPerPage),
  );

  const sheets = pages.map((pageRecords, pageIndex) => `
    <div class="sheet">
      <div class="masthead"><div class="brand">Vehicle Management System</div><div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div></div>
      <div class="title"><div><h1>Selected ${kind} Records</h1><p>Official fleet ${kindLower} history and expenditure report</p></div><span class="badge">${kind.toUpperCase()} REPORT</span></div>
      ${pageIndex === 0 ? `<div class="summary"><div><span>SELECTED RECORDS</span><strong>${records.length}</strong></div><div><span>VEHICLES</span><strong>${new Set(records.map((record) => record.vehicle).filter(Boolean)).size}</strong></div><div><span>TOTAL ${kind.toUpperCase()} COST</span><strong>LKR ${money(totalCost)}</strong></div></div>` : ""}
      <h2>${kind} Record Details</h2>
      <table><thead><tr><th>No.</th><th>${kind} Date</th><th>Vehicle</th><th>Vehicle Model</th><th>${kind} Type</th><th class="number">Cost (LKR)</th></tr></thead>
      <tbody>${pageRecords.map((record, index) => `<tr><td>${pageIndex * recordsPerPage + index + 1}</td><td>${escapeHtml(date(record.repair_date))}</td><td><strong>${escapeHtml(record.vehicle || "-")}</strong></td><td>${escapeHtml(record.model || "-")}</td><td>${escapeHtml(record.repair_type || "-")}</td><td class="number">${money(record.cost)}</td></tr>`).join("")}</tbody>
      ${pageIndex === pages.length - 1 ? `<tfoot><tr><td colspan="5">Selected records total</td><td class="number">${money(totalCost)}</td></tr></tfoot>` : ""}</table>
      ${pageIndex === pages.length - 1 ? `<div class="reference"><strong>Document Reference</strong>Selected ${kind} Records &nbsp;|&nbsp; ${records.length} record${records.length === 1 ? "" : "s"} &nbsp;|&nbsp; Generated ${escapeHtml(generatedAt)} by the Vehicle Management System</div>` : ""}
      <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page ${pageIndex + 1} of ${pages.length}</span></div>
    </div>`).join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  printWindow.opener = null;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Selected ${kind} Records</title><style>
    @page { size: A4 landscape; margin: 0; } * { box-sizing: border-box; }
    html,body { margin:0; padding:0; background:#eef1f5; color:#172033; font-family:Arial,sans-serif; }
    .sheet { position:relative; width:297mm; height:204mm; margin:0 auto; padding:38mm 14mm 18mm; background:#fff; page-break-after:always; break-after:page; overflow:hidden; }
    .sheet:last-child { page-break-after:auto; }
    .masthead { position:absolute; top:0; left:0; right:0; display:flex; height:29mm; flex-direction:column; align-items:center; justify-content:center; border-bottom:2mm solid #2c79c7; background:#0b2f5b; color:#fff; text-align:center; }
    .brand { font-size:18pt; font-weight:700; line-height:1; } .sub { margin-top:2.5mm; color:#d6e7f7; font-size:8.8pt; }
    .title { display:flex; align-items:center; justify-content:space-between; margin-bottom:5mm; } h1 { margin:0; font-size:21pt; } .title p { margin:1.5mm 0 0; color:#647084; font-size:9pt; }
    .badge { border-radius:20px; background:#e8f3ff; color:#1558a6; padding:3mm 6mm; font-size:8pt; font-weight:700; letter-spacing:.4px; }
    .summary { display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; margin-bottom:5mm; } .summary div { border:.2mm solid #d6e0ea; border-radius:2mm; background:#f8fafc; padding:2.5mm 4mm; }
    .summary span { display:block; margin-bottom:1mm; color:#647084; font-size:6.5pt; font-weight:700; letter-spacing:.35px; } .summary strong { color:#0b2f5b; font-size:12pt; }
    h2 { margin:0 0 2.5mm; border-left:1.4mm solid #1558a6; padding:1.5mm 0 1.5mm 3mm; color:#0b2f5b; font-size:11.5pt; text-transform:uppercase; }
    table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:8pt; } th { background:#0b2f5b; color:#fff; padding:2.7mm 2mm; text-align:left; font-size:6.7pt; text-transform:uppercase; letter-spacing:.25px; }
    th:nth-child(1){width:7%} th:nth-child(2){width:14%} th:nth-child(3){width:16%} th:nth-child(4){width:25%} th:nth-child(5){width:23%} th:nth-child(6){width:15%}
    td { border:.2mm solid #d6e0ea; padding:2.1mm 2mm; overflow-wrap:anywhere; } tbody tr:nth-child(even){background:#f8fafc} .number{text-align:right}
    tfoot td { background:#edf5fd; color:#0b2f5b; font-weight:700; } tfoot td:first-child{text-align:right}
    .reference { margin-top:5mm; border-radius:2mm; background:#edf5fd; padding:4mm; color:#647084; font-size:7.3pt; } .reference strong{display:block;margin-bottom:1.5mm;color:#0b2f5b;font-size:8pt}
    .footer { position:absolute; right:14mm; bottom:6mm; left:14mm; display:flex; justify-content:space-between; border-top:.2mm solid #d6e0ea; padding-top:2.5mm; color:#647084; font-size:7.5pt; }
    @media screen {.sheet{box-shadow:0 8px 30px rgba(15,23,42,.16)}} @media print {html,body{background:#fff}.sheet{margin:0;box-shadow:none}.sheet:last-child{page-break-after:avoid;break-after:avoid-page}}
  </style></head><body>${sheets}<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});</script></body></html>`);
  printWindow.document.close();
}
