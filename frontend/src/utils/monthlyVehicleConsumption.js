import { monthlyFuelAnalysis } from "./monthlyFuelAnalysis.js";

// Requested estimate: actual kilometers times the stored numeric efficiency.
export function monthlyVehicleConsumption(journeys, registration, year, filters = {}) {
  if (!registration) {
    const registrations = new Set(journeys.map(journey => journey.allocated_vehicle?.registration_number).filter(Boolean));
    const totals = {};
    for (const vehicle of registrations) {
      for (const [month, value] of Object.entries(monthlyVehicleConsumption(journeys, vehicle, year, filters))) {
        // Do not present an incomplete fleet estimate as a complete total.
        if (value == null || totals[month] === null) totals[month] = null;
        else totals[month] = (totals[month] ?? 0) + value;
      }
    }
    return totals;
  }
  const search = (filters.search || "").trim().toLowerCase();
  const selected = journeys.filter(journey => {
    const vehicle = journey.allocated_vehicle;
    return (journey.status === "completed" || journey.journey_status === "completed") &&
      vehicle?.registration_number === registration &&
      (!filters.fuelType || vehicle.fuel_type === filters.fuelType) &&
      `${vehicle.registration_number} ${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase().includes(search);
  });
  const efficiency = Number(selected[0]?.allocated_vehicle?.fuel_efficiency);
  return Object.fromEntries(monthlyFuelAnalysis(selected)
    .filter(row => row.month.startsWith(`${year}-`))
    .map(row => {
      const value = row.actual == null || !Number.isFinite(efficiency) || efficiency <= 0 ? null : row.actual * efficiency;
      return [row.month, value != null && Number.isFinite(value) ? value : null];
    }));
}
