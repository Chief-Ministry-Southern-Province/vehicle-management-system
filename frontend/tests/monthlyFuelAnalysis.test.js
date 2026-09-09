import test from "node:test";
import assert from "node:assert/strict";
import { monthlyFuelAnalysis } from "../src/utils/monthlyFuelAnalysis.js";

test("monthly analysis sorts year-months and uses Colombo completion dates", () => {
  const row = { distance_km: 10, actual_distance_km: 24, allocated_vehicle: { fuel_efficiency: 0.5 } };
  assert.deepEqual(monthlyFuelAnalysis([
    { ...row, id: 1, journey_completed_at: "2027-01-01T00:00:00Z" },
    { ...row, id: 2, journey_completed_at: "2026-05-31T18:30:00Z" },
    { ...row, id: 3, journey_completed_at: "2026-05-31T18:29:59Z" },
    { ...row, id: 4, journey_completed_at: null },
    { ...row, id: 5, journey_completed_at: "invalid" },
  ]), [
    { month: "2026-05", allocated: 20, actual: 24, extraFuel: 2 },
    { month: "2026-06", allocated: 20, actual: 24, extraFuel: 2 },
    { month: "2027-01", allocated: 20, actual: 24, extraFuel: 2 },
  ]);
});

test("monthly totals retain table semantics for shared trips, missing data and negative fuel", () => {
  const shared = { allocated_vehicle_id: 1, allocated_driver_id: 2,
    journey_started_at: "2026-06-10T00:00:00Z", journey_completed_at: "2026-06-10T01:00:00Z",
    start_odometer_km: 100, end_odometer_km: 120, actual_distance_km: 20,
    distance_km: 15, allocated_vehicle: { fuel_efficiency: 0.5 } };
  assert.deepEqual(monthlyFuelAnalysis([{ ...shared, id: 1 }, { ...shared, id: 2 }]),
    [{ month: "2026-06", allocated: 60, actual: 20, extraFuel: -10 }]);
  assert.deepEqual(monthlyFuelAnalysis([{ id: 3, journey_completed_at: "2026-07-01T00:00:00Z" }]),
    [{ month: "2026-07", allocated: null, actual: null, extraFuel: null }]);
  assert.deepEqual(monthlyFuelAnalysis([{ ...shared, distance_km: 0, actual_distance_km: 0 }]),
    [{ month: "2026-06", allocated: 0, actual: 0, extraFuel: 0 }]);
  assert.deepEqual(monthlyFuelAnalysis([]), []);
});
