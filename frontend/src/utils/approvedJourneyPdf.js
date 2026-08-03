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

  const content = [
    section("Request Information", [
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
    ]),
    section("Recommendation", [
      row("Recommendation status", label(journey.recommendation_status)),
      row("Department priority", label(journey.department_priority)),
      row("Recommended by", text(journey.recommender?.name)),
      row("Recommender employee ID", text(journey.recommender?.employee_id)),
      row("Recommended at", dateTime(journey.recommended_at)),
      row("Recommendation notes", text(journey.recommendation_notes)),
    ]),
    section("Allocated Vehicle", [
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
    ]),
    section("Allocated Driver", [
      row("Driver name", text(driver.full_name)),
      row("Driver ID", text(driver.driver_id)),
      row("Contact number", text(driver.contact_number)),
      row("NIC", text(driver.nic)),
      row("Licence number", text(driver.licence_number)),
      row("Licence type", text(driver.licence_type)),
    ]),
    section("Approval and Journey", [
      row("Approved by", text(journey.approver?.name)),
      row("Approved at", dateTime(journey.approved_at)),
      row("Journey status", label(journey.journey_status)),
      row("Journey started at", dateTime(journey.journey_started_at)),
      row("Journey completed at", dateTime(journey.journey_completed_at)),
      row("Cancelled at", dateTime(journey.cancelled_at)),
      row("Reallocation reason", text(journey.reallocation_reason)),
      row("Reallocated at", dateTime(journey.reallocated_at)),
    ]),
  ].join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("The PDF window was blocked. Allow pop-ups and try again.");
  }
  printWindow.opener = null;

  printWindow.document.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(requestId)} - Approved Journey</title>
<style>
  @page { size: A4; margin: 34mm 14mm 24mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #172033; font: 10.5pt Arial, sans-serif; background: white; }
  header { position: fixed; top: -27mm; left: 0; right: 0; height: 22mm; border-bottom: 2px solid #174a8b; display: flex; align-items: center; justify-content: space-between; }
  header .brand { font-size: 15pt; font-weight: 800; color: #123b70; letter-spacing: .3px; }
  header .sub { margin-top: 3px; color: #596579; font-size: 8.5pt; }
  header .official { border: 1px solid #174a8b; border-radius: 4px; padding: 5px 9px; color: #174a8b; font-size: 8pt; font-weight: 700; letter-spacing: 1px; }
  footer { position: fixed; bottom: -17mm; left: 0; right: 0; height: 12mm; border-top: 1px solid #b9c3d1; padding-top: 4px; display: flex; justify-content: space-between; color: #647084; font-size: 8pt; }
  footer .page:after { content: "Page " counter(page); }
  .title { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8mm; }
  h1 { margin: 0; color: #123b70; font-size: 22pt; }
  .title p { margin: 5px 0 0; color: #647084; }
  .badge { border-radius: 20px; background: #dcfce7; color: #167447; padding: 7px 12px; font-size: 9pt; font-weight: 700; text-transform: uppercase; }
  section { margin-bottom: 6mm; break-inside: avoid; }
  h2 { margin: 0; padding: 7px 10px; border-left: 4px solid #174a8b; background: #eef4fb; color: #123b70; font-size: 11.5pt; text-transform: uppercase; letter-spacing: .5px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #d9e0e9; border-top: 0; }
  .field { min-height: 14mm; padding: 7px 10px; border-bottom: 1px solid #e5eaf0; }
  .field:nth-child(odd) { border-right: 1px solid #e5eaf0; }
  .field span { display: block; margin-bottom: 4px; color: #69758a; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
  .field strong { display: block; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 9.5pt; }
  .notice { margin-top: 8mm; border-top: 1px solid #ccd5e0; padding-top: 4mm; color: #69758a; font-size: 8pt; }
</style></head><body>
<header><div><div class="brand">Government Vehicle Management System</div><div class="sub">Official Approved Journey Record</div></div><div class="official">OFFICIAL</div></header>
<footer><span>Generated ${escapeHtml(generatedAt)} | ${escapeHtml(requestId)}</span><span class="page"></span></footer>
<main><div class="title"><div><h1>Approved Journey</h1><p>${escapeHtml(requestId)} - Complete request and allocation record</p></div><span class="badge">Approved</span></div>${content}<p class="notice">This document was generated electronically by the Vehicle Management System and contains the information recorded at the time of generation.</p></main>
<script>window.addEventListener("load",()=>{setTimeout(()=>window.print(),250)});<\/script>
</body></html>`);
  printWindow.document.close();
}
