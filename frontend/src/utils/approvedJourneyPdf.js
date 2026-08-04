import { formatLocalDateTime } from "./dateTime";

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const text = (value) => escapeHtml(value || "—");
const dateTime = (value) => escapeHtml(formatLocalDateTime(value));
const label = (value) =>
  text(value ? String(value).replaceAll("_", " ") : "Not recorded");

const row = (name, value) => `
  <div class="field"><span>${escapeHtml(name)}</span><strong>${value}</strong></div>`;

const section = (title, rows) => `
  <section><h2>${escapeHtml(title)}</h2><div class="grid">${rows.join("")}</div></section>`;

export function generateApprovedJourneyPdf(journey) {
  const vehicle = journey.allocated_vehicle || {};
  const driver = journey.allocated_driver || {};
  const requester = journey.user || {};
  const generatedAt = new Intl.DateTimeFormat("en-LK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());
  const requestId = `REQ-${String(journey.id).padStart(4, "0")}`;

  const requestSection = section("Request Information", [
      row("Request number", text(requestId)),
      row("Request status", label(journey.status)),
      row("Requester", text(journey.requester_name || requester.name)),
      row("Employee ID", text(requester.employee_id)),
      row("Department", text(requester.department)),
      row("Purpose", text(journey.purpose)),
      row("Destination", text(journey.destination)),
      row("Departure", dateTime(journey.departure_at)),
      row("Expected arrival", dateTime(journey.expected_return_at)),
      row("Passenger count", text(journey.passenger_count)),
      row("Passenger names", text(journey.passenger_names)),
      row("Submitted", dateTime(journey.created_at)),
      row("Attachment", text(journey.attachment_original_name)),
    ]);
  const recommendationSection = section("Recommendation", [
      row("Recommendation status", label(journey.recommendation_status)),
      row("Department priority", label(journey.department_priority)),
      row("Recommended by", text(journey.recommender?.name)),
      row("Recommender employee ID", text(journey.recommender?.employee_id)),
      row("Recommended at", dateTime(journey.recommended_at)),
      row("Recommendation notes", text(journey.recommendation_notes)),
    ]);
  const vehicleSection = section("Allocated Vehicle", [
      row("Registration number", text(vehicle.registration_number)),
      row("Vehicle", text([vehicle.make, vehicle.model].filter(Boolean).join(" "))),
      row("Vehicle type", text(vehicle.vehicle_type)),
      row("Seat capacity", text(vehicle.seat_capacity)),
      row("Fuel type", text(vehicle.fuel_type)),
      row("Colour", text(vehicle.color)),
      row("Parking location", text(journey.parking_location)),
      row("Allocated by", text(journey.allocator?.name)),
      row("Allocated at", dateTime(journey.allocated_at)),
      row("Driver notified at", dateTime(journey.driver_notified_at)),
    ]);
  const driverSection = section("Allocated Driver", [
      row("Driver name", text(driver.full_name)),
      row("Driver ID", text(driver.driver_id)),
      row("Contact number", text(driver.contact_number)),
      row("NIC", text(driver.nic)),
      row("Licence number", text(driver.licence_number)),
      row("Licence type", text(driver.licence_type)),
    ]);
  const approvalSection = section("Approval and Journey", [
      row("Approved by", text(journey.approver?.name)),
      row("Approved at", dateTime(journey.approved_at)),
      row("Journey status", label(journey.journey_status)),
      row("Journey started at", dateTime(journey.journey_started_at)),
      row("Journey completed at", dateTime(journey.journey_completed_at)),
      row("Cancelled at", dateTime(journey.cancelled_at)),
      row("Reallocation reason", text(journey.reallocation_reason)),
      row("Reallocated at", dateTime(journey.reallocated_at)),
    ]);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  }
  printWindow.opener = null;

  printWindow.document.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(requestId)} - Approved Journey</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #eef1f5; color: #172033; font-family: Arial, sans-serif; }
  .sheet { position: relative; width: 210mm; min-height: 297mm; margin: 0 auto 8mm; padding: 48mm 18mm 21mm; background: #fff; page-break-after: always; overflow: hidden; }
  .sheet:last-child { page-break-after: auto; }
  .masthead { position: absolute; top: 0; left: 0; right: 0; height: 34mm; border-bottom: 2.2mm solid #2c79c7; background: #0b2f5b; color: #fff; text-align: center; padding-top: 17mm; }
  .masthead .brand { font-size: 18pt; font-weight: 700; line-height: 1; }
  .masthead .sub { margin-top: 3mm; color: #d6e7f7; font-size: 8.8pt; }
  .title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8mm; }
  h1 { margin: 0; color: #172033; font-size: 22pt; line-height: 1.1; }
  .title p { margin: 2mm 0 0; color: #647084; font-size: 9pt; }
  .badge { border-radius: 20px; background: #eaf7ef; color: #16803a; padding: 3mm 6mm; font-size: 8pt; font-weight: 700; letter-spacing: .3px; }
  section { margin-bottom: 6mm; break-inside: avoid; }
  h2 { margin: 0 0 3mm; border-left: 1.4mm solid #1558a6; padding: 2mm 0 2mm 3mm; color: #0b2f5b; font-size: 11.5pt; text-transform: uppercase; letter-spacing: .3px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; border: .2mm solid #d6e0ea; border-bottom: 0; }
  .field { min-height: 13.2mm; padding: 3mm; border-bottom: .2mm solid #d6e0ea; background: #fff; }
  .field:nth-child(4n+3), .field:nth-child(4n+4) { background: #f8fafc; }
  .field:nth-child(odd) { border-right: .2mm solid #d6e0ea; }
  .field span { display: block; margin-bottom: 1.5mm; color: #647084; font-size: 6.4pt; font-weight: 700; text-transform: uppercase; letter-spacing: .35px; }
  .field strong { display: block; color: #172033; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 8.1pt; line-height: 1.25; }
  .reference { margin-top: 9mm; border-radius: 3mm; background: #edf5fd; padding: 5mm 4mm; color: #647084; font-size: 7.4pt; }
  .reference strong { display: block; margin-bottom: 2mm; color: #0b2f5b; font-size: 8pt; }
  .notice { margin-top: 5mm; border-top: .2mm solid #d6e0ea; padding-top: 4mm; color: #647084; font-size: 7.3pt; }
  .footer { position: absolute; right: 18mm; bottom: 8mm; left: 18mm; display: flex; justify-content: space-between; border-top: .2mm solid #d6e0ea; padding-top: 4mm; color: #647084; font-size: 7.5pt; }
  @media screen { .sheet { box-shadow: 0 8px 30px rgba(15,23,42,.16); } }
  @media print { html, body { background: #fff; } .sheet { margin: 0; box-shadow: none; } }
</style></head><body>
<div class="sheet">
  <div class="masthead"><div class="brand">Vehicle Management System</div><div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div></div>
  <div class="title"><div><h1>Approved Journey</h1><p>${escapeHtml(requestId)} &nbsp;|&nbsp; Complete request and allocation record</p></div><span class="badge">APPROVED</span></div>
  ${requestSection}${recommendationSection}
  <div class="reference"><strong>Document Reference</strong>Approved Journey Record &nbsp;|&nbsp; ${escapeHtml(requestId)} &nbsp;|&nbsp; Generated electronically by the Vehicle Management System</div>
  <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page 1 of 2</span></div>
</div>
<div class="sheet">
  <div class="masthead"><div class="brand">Vehicle Management System</div><div class="sub">Chief Ministry&nbsp;&nbsp; | &nbsp;&nbsp;Dakshinapaya, Labuduwa, Galle</div></div>
  <div class="title"><div><h1>Vehicle Allocation &amp; Journey</h1><p>${escapeHtml(requestId)} &nbsp;|&nbsp; Complete request and allocation record</p></div><span class="badge">APPROVED</span></div>
  ${vehicleSection}${driverSection}${approvalSection}
  <p class="notice">This document was generated electronically by the Vehicle Management System and contains information recorded at the time of generation. Generated ${escapeHtml(generatedAt)}.</p>
  <div class="footer"><span>Chief Ministry - Southern Province</span><span>Page 2 of 2</span></div>
</div>
<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});<\/script>
</body></html>`);
  printWindow.document.close();
}
