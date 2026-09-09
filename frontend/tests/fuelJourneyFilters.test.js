import test from "node:test";
import assert from "node:assert/strict";
import { filterFuelJourneys } from "../src/utils/fuelJourneyFilters.js";

const journey = { allocated_vehicle: { registration_number: "CAB-1234" }, allocated_driver: { full_name: "Nimal Silva" } };
const records = [
  { ...journey, id: 1, journey_completed_at: "2026-05-05T18:30:00Z" },
  { ...journey, id: 2, journey_completed_at: "2026-06-10T18:29:59Z" },
  { ...journey, id: 3, journey_completed_at: "2026-06-10T18:30:00Z" },
  { id: 4, journey_completed_at: null },
  { ...journey, id: 5, journey_completed_at: "invalid" },
];
const ids = (filters) => filterFuelJourneys(records, filters).map(({ id }) => id);

test("vehicle and driver filters combine with an inclusive Colombo completion date range", () => {
  assert.deepEqual(ids({ vehicleNumber: " cab- ", driverName: " SILVA ", from: "2026-05-06", to: "2026-06-10" }), [1, 2]);
  assert.deepEqual(ids({ vehicleNumber: "9999", driverName: "Silva" }), []);
  assert.deepEqual(ids({ vehicleNumber: "1234", driverName: "other" }), []);
});

test("date filters support one-sided ranges, missing timestamps, clearing and reversed dates", () => {
  assert.deepEqual(ids({}), [1, 2, 3, 4, 5]);
  assert.deepEqual(ids({ to: "2026-05-06" }), [1]);
  assert.deepEqual(ids({ from: "2026-06-11" }), [3]);
  assert.deepEqual(ids({ from: "2026-06-10", to: "2026-06-10" }), [2]);
  assert.deepEqual(ids({ from: "2026-06-10", to: "2026-05-06" }), []);
});
