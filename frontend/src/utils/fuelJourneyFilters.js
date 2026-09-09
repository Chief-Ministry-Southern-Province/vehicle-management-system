import { LOCAL_TIME_ZONE } from "./dateTime.js";

const localDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: LOCAL_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
});

export function filterFuelJourneys(journeys, { vehicleNumber = "", driverName = "", from = "", to = "" } = {}) {
  if (from && to && from > to) return [];
  const vehicle = vehicleNumber.trim().toLowerCase();
  const driver = driverName.trim().toLowerCase();
  return journeys.filter((journey) => {
    if (!String(journey.allocated_vehicle?.registration_number ?? "").toLowerCase().includes(vehicle)) return false;
    if (!String(journey.allocated_driver?.full_name ?? "").toLowerCase().includes(driver)) return false;
    if (!from && !to) return true;
    if (!journey.journey_completed_at) return false;
    const date = new Date(journey.journey_completed_at);
    if (Number.isNaN(date.getTime())) return false;
    const parts = Object.fromEntries(localDate.formatToParts(date).map(({ type, value }) => [type, value]));
    const day = `${parts.year}-${parts.month}-${parts.day}`;
    return (!from || day >= from) && (!to || day <= to);
  });
}
