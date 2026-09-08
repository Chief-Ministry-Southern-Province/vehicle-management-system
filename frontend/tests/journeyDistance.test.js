import test from "node:test";
import assert from "node:assert/strict";
import { actualJourneyDistance, totalActualJourneyDistance } from "../src/utils/journeyDistance.js";

test("completed journey uses actual distance without doubling the planned route", () => {
  assert.equal(actualJourneyDistance({ actual_distance_km: 100, distance_km: 42 }), 100);
  assert.equal(actualJourneyDistance({ actual_distance_km: 0, distance_km: 42 }), 0);
  assert.equal(actualJourneyDistance({ actual_distance_km: null, distance_km: 42 }), null);
  assert.equal(actualJourneyDistance({ distance_km: 42 }), null);
});

test("total counts a consolidated vehicle journey once and preserves missing readings", () => {
  const shared = { allocated_vehicle_id: 1, allocated_driver_id: 2,
    journey_started_at: "2026-09-08T09:00:00Z", journey_completed_at: "2026-09-08T10:00:00Z",
    start_odometer_km: 125000, end_odometer_km: 125100, actual_distance_km: 100 };
  assert.equal(totalActualJourneyDistance([{ ...shared, id: 1 }, { ...shared, id: 2 },
    { ...shared, id: 3, allocated_vehicle_id: 3 }, { id: 4, distance_km: 20 }]), 200);
  assert.equal(totalActualJourneyDistance([{ id: 1, actual_distance_km: 0 }]), 0);
  assert.equal(totalActualJourneyDistance([{ id: 1, distance_km: 20 }]), null);
  assert.equal(totalActualJourneyDistance([{ id: 1, actual_distance_km: 0.1 },
    { id: 2, actual_distance_km: 0.2 }]), 0.3);
});

import { allocatedJourneyDistance, totalAllocatedJourneyDistance, extraJourneyFuel } from "../src/utils/journeyDistance.js";

test("extra fuel uses the assigned vehicle efficiency and allocated round trip", () => {
  const journey = { distance_km: "40", actual_distance_km: "100", allocated_vehicle: { fuel_efficiency: "0.25" } };
  assert.equal(extraJourneyFuel(journey), 5);
  assert.equal(extraJourneyFuel({ ...journey, actual_distance_km: 80 }), 0);
  assert.equal(extraJourneyFuel({ ...journey, actual_distance_km: 60 }), -5);
  assert.equal(extraJourneyFuel({ ...journey, actual_distance_km: 0, distance_km: 0 }), 0);
  assert.equal(extraJourneyFuel({ ...journey, allocated_vehicle: { fuel_efficiency: "0.5" } }), 10);
  for (const value of [null, undefined, "", "invalid", -1]) {
    assert.equal(extraJourneyFuel({ ...journey, distance_km: value }), null);
    assert.equal(extraJourneyFuel({ ...journey, actual_distance_km: value }), null);
    assert.equal(extraJourneyFuel({ ...journey, allocated_vehicle: { fuel_efficiency: value } }), null);
  }
  assert.equal(extraJourneyFuel({ ...journey, allocated_vehicle: null }), null);
  assert.equal(extraJourneyFuel({ ...journey, allocated_vehicle: { fuel_efficiency: 0 } }), null);
});

test("allocated mileage doubles planned routes, preserves zero, and excludes missing values", () => {
  assert.equal(allocatedJourneyDistance({ distance_km: "42.75", actual_distance_km: 100 }), 85.5);
  assert.equal(allocatedJourneyDistance({ distance_km: 0 }), 0);
  for (const value of [null, undefined, "", -1, "invalid"]) {
    assert.equal(allocatedJourneyDistance({ distance_km: value }), null);
  }
  assert.equal(totalAllocatedJourneyDistance([{ distance_km: 0.1 }, { distance_km: 0.2 }, { distance_km: null }]), 0.6);
  assert.equal(totalAllocatedJourneyDistance([{ distance_km: 0 }]), 0);
  assert.equal(totalAllocatedJourneyDistance([]), null);
  assert.equal(totalAllocatedJourneyDistance([{ distance_km: 20 }, { distance_km: 30 }]), 100);
});
