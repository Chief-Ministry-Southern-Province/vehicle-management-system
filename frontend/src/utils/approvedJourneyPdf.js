import { formatLocalDateTime } from "./dateTime";

const escapeHtml = (value) =>
  String(value ?? "â€”")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const text = (value) => escapeHtml(value || "â€”");
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
  .sheet { position: relative; width: 210mm; height: 296mm; margin: 0 auto; padding: 39mm 16mm 17mm; background: #fff; page-break-after: always; overflow: hidden; }
  .sheet:last-child { page-break-after: auto; }
  .masthead { position: absolute; top: 0; left: 0; right: 0; display: flex; height: 30mm; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1.8mm solid #2c79c7; background: #0b2f5b; color: #fff; text-align: center; }
  .masthead .brand { font-size: 16pt; font-weight: 700; line-height: 1; }
  .masthead .sub { margin-top: 2mm; color: #d6e7f7; font-size: 7.8pt; }
  .title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4mm; }
  h1 { margin: 0; color: #172033; font-size: 19pt; line-height: 1.1; }
  .title p { margin: 1.2mm 0 0; color: #647084; font-size: 8pt; }
  .badge { border-radius: 20px; background: #eaf7ef; color: #16803a; padding: 2mm 5mm; font-size: 7pt; font-weight: 700; letter-spacing: .3px; }
  section { margin-bottom: 3.5mm; break-inside: avoid; }
  h2 { margin: 0 0 2mm; border-left: 1.2mm solid #1558a6; padding: 1.2mm 0 1.2mm 2.5mm; color: #0b2f5b; font-size: 10pt; text-transform: uppercase; letter-spacing: .3px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; border: .2mm solid #d6e0ea; border-bottom: 0; }
  .field { min-height: 9.5mm; padding: 2mm 2.5mm; border-bottom: .2mm solid #d6e0ea; background: #fff; }
  .field:nth-child(4n+3), .field:nth-child(4n+4) { background: #f8fafc; }
  .field:nth-child(odd) { border-right: .2mm solid #d6e0ea; }
  .field span { display: block; margin-bottom: .8mm; color: #647084; font-size: 5.8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .35px; }
  .field strong { display: block; color: #172033; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 7.4pt; line-height: 1.2; }
  .reference { margin-top: 4mm; border-radius: 2mm; background: #edf5fd; padding: 3mm; color: #647084; font-size: 6.8pt; }
  .reference strong { display: block; margin-bottom: 1mm; color: #0b2f5b; font-size: 7.4pt; }
  .notice { margin-top: 2.5mm; border-top: .2mm solid #d6e0ea; padding-top: 2.5mm; color: #647084; font-size: 6.7pt; }
  .footer { position: absolute; right: 16mm; bottom: 6mm; left: 16mm; display: flex; justify-content: space-between; border-top: .2mm solid #d6e0ea; padding-top: 2.5mm; color: #647084; font-size: 6.8pt; }
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
<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});</script>
</body></html>`);
  printWindow.document.close();
}
