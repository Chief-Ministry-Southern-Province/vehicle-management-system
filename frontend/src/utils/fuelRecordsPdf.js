const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value || "-"
    : new Intl.DateTimeFormat("en-LK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: "Asia/Colombo",
      }).format(date);
};

export function generateFuelRecordsPdf(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Select at least one fuel record to export.");
  }

  const generatedAt = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
  const totalLiters = records.reduce(
    (total, record) => total + (Number(record.capacity) || 0),
    0,
  );
  const totalCost = records.reduce(
    (total, record) => total + (Number(record.cost) || 0),
    0,
  );
  const recordsPerPage = 15;
  const pages = Array.from(
    { length: Math.ceil(records.length / recordsPerPage) },
    (_, index) => records.slice(index * recordsPerPage, (index + 1) * recordsPerPage),
  );

  const pageHtml = pages
    .map(
      (pageRecords, pageIndex) => `
      <div class="sheet">
        <div class="masthead">
          <div class="brand">Vehicle Management System</div>
          <div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div>
        </div>
        <div class="title">
          <div><h1>Selected Fuel Records</h1><p>Official fleet fuel consumption and expenditure report</p></div>
          <span class="badge">FUEL REPORT</span>
        </div>
        ${
          pageIndex === 0
            ? `<div class="summary">
                <div><span>SELECTED RECORDS</span><strong>${records.length}</strong></div>
                <div><span>TOTAL FUEL</span><strong>${formatNumber(totalLiters)} L</strong></div>
                <div><span>TOTAL COST</span><strong>LKR ${formatNumber(totalCost)}</strong></div>
              </div>`
            : ""
        }
        <h2>Fuel Transaction Details</h2>
        <table>
          <thead><tr><th>No.</th><th>Date</th><th>Vehicle</th><th>Vehicle Model</th><th>Fuel Type</th><th class="number">Liters</th><th class="number">Cost (LKR)</th></tr></thead>
          <tbody>${pageRecords
            .map(
              (record, index) => `<tr>
                <td>${pageIndex * recordsPerPage + index + 1}</td>
                <td>${escapeHtml(formatDate(record.date))}</td>
                <td><strong>${escapeHtml(record.vehicle || "-")}</strong></td>
                <td>${escapeHtml(record.model || "-")}</td>
                <td class="capitalize">${escapeHtml(record.fuel_type || "-")}</td>
                <td class="number">${formatNumber(record.capacity)}</td>
                <td class="number">${formatNumber(record.cost)}</td>
              </tr>`,
            )
            .join("")}</tbody>
          ${
            pageIndex === pages.length - 1
              ? `<tfoot><tr><td colspan="5">Selected records total</td><td class="number">${formatNumber(totalLiters)}</td><td class="number">${formatNumber(totalCost)}</td></tr></tfoot>`
              : ""
          }
        </table>
        ${
          pageIndex === pages.length - 1
            ? `<div class="reference"><strong>Document Reference</strong>Selected Fuel Records &nbsp;|&nbsp; ${records.length} transaction${records.length === 1 ? "" : "s"} &nbsp;|&nbsp; Generated electronically by the Vehicle Management System</div>`
            : ""
        }
        <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page ${pageIndex + 1} of ${pages.length}</span></div>
      </div>`,
    )
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  }
  printWindow.opener = null;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Selected Fuel Records</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #eef1f5; color: #172033; font-family: Arial, sans-serif; }
    .sheet { position: relative; width: 297mm; min-height: 210mm; margin: 0 auto 8mm; padding: 40mm 14mm 20mm; background: #fff; page-break-after: always; overflow: hidden; }
    .sheet:last-child { page-break-after: auto; }
    .masthead { position: absolute; top: 0; left: 0; right: 0; display: flex; height: 29mm; flex-direction: column; align-items: center; justify-content: center; border-bottom: 2mm solid #2c79c7; background: #0b2f5b; color: #fff; text-align: center; }
    .brand { font-size: 18pt; font-weight: 700; line-height: 1; }
    .sub { margin-top: 2.5mm; color: #d6e7f7; font-size: 8.8pt; }
    .title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5mm; }
    h1 { margin: 0; color: #172033; font-size: 21pt; }
    .title p { margin: 1.5mm 0 0; color: #647084; font-size: 9pt; }
    .badge { border-radius: 20px; background: #e8f3ff; color: #1558a6; padding: 3mm 6mm; font-size: 8pt; font-weight: 700; letter-spacing: .4px; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-bottom: 5mm; }
    .summary div { border: .2mm solid #d6e0ea; border-radius: 2mm; background: #f8fafc; padding: 3mm 4mm; }
    .summary span { display: block; margin-bottom: 1mm; color: #647084; font-size: 6.5pt; font-weight: 700; letter-spacing: .35px; }
    .summary strong { color: #0b2f5b; font-size: 12pt; }
    h2 { margin: 0 0 2.5mm; border-left: 1.4mm solid #1558a6; padding: 1.5mm 0 1.5mm 3mm; color: #0b2f5b; font-size: 11.5pt; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 7.7pt; }
    th { background: #0b2f5b; color: #fff; padding: 2.7mm 2mm; text-align: left; font-size: 6.7pt; text-transform: uppercase; letter-spacing: .25px; }
    th:nth-child(1) { width: 7%; } th:nth-child(2) { width: 13%; } th:nth-child(3) { width: 14%; } th:nth-child(4) { width: 24%; } th:nth-child(5) { width: 12%; } th:nth-child(6) { width: 13%; } th:nth-child(7) { width: 17%; }
    td { border: .2mm solid #d6e0ea; padding: 2.6mm 2mm; overflow-wrap: anywhere; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .number { text-align: right; }
    .capitalize { text-transform: capitalize; }
    tfoot td { background: #edf5fd; color: #0b2f5b; font-weight: 700; }
    tfoot td:first-child { text-align: right; }
    .reference { margin-top: 5mm; border-radius: 2mm; background: #edf5fd; padding: 4mm; color: #647084; font-size: 7.3pt; }
    .reference strong { display: block; margin-bottom: 1.5mm; color: #0b2f5b; font-size: 8pt; }
    .footer { position: absolute; right: 14mm; bottom: 7mm; left: 14mm; display: flex; justify-content: space-between; border-top: .2mm solid #d6e0ea; padding-top: 3mm; color: #647084; font-size: 7.5pt; }
    @media screen { .sheet { box-shadow: 0 8px 30px rgba(15,23,42,.16); } }
    @media print { html, body { background: #fff; } .sheet { margin: 0; box-shadow: none; } }
  </style></head><body>${pageHtml}<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});<\/script></body></html>`);
  printWindow.document.close();
}
