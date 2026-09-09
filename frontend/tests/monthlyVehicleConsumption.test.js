import test from "node:test";
import assert from "node:assert/strict";
import { monthlyVehicleConsumption } from "../src/utils/monthlyVehicleConsumption.js";

const trip = { id: 1, status: "completed", actual_distance_km: 100, distance_km: 20,
  allocated_vehicle_id: 1, allocated_driver_id: 2, journey_started_at: "2026-05-31T17:00:00Z",
  journey_completed_at: "2026-05-31T18:30:00Z", start_odometer_km: 100, end_odometer_km: 200,
  allocated_vehicle: { registration_number: "CAB-1234", fuel_type: "diesel", fuel_efficiency: "0.2" } };

test("consumption uses actual distance, local completion month, and counts shared trips once", () => {
  assert.deepEqual(monthlyVehicleConsumption([trip, { ...trip, id: 2 }], "CAB-1234", "2026"), { "2026-06": 20 });
  assert.deepEqual(monthlyVehicleConsumption([trip], "OTHER", "2026"), {});
  assert.deepEqual(monthlyVehicleConsumption([trip], "CAB-1234", "2025"), {});
  assert.deepEqual(monthlyVehicleConsumption([trip], "CAB-1234", "2026", { fuelType: "petrol" }), {});
  assert.deepEqual(monthlyVehicleConsumption([{ ...trip, status: "approved" }], "CAB-1234", "2026"), {});
});
test("consumption preserves zero and missing measurements", () => {
  const calculate = row => monthlyVehicleConsumption([row], "CAB-1234", "2026");
  assert.deepEqual(calculate({ ...trip, actual_distance_km: 0 }), { "2026-06": 0 });
  assert.deepEqual(calculate({ ...trip, actual_distance_km: null }), { "2026-06": null });
  assert.deepEqual(calculate({ ...trip, allocated_vehicle: { ...trip.allocated_vehicle, fuel_efficiency: null } }), { "2026-06": null });
  assert.deepEqual(calculate({ ...trip, journey_completed_at: null }), {});
});
