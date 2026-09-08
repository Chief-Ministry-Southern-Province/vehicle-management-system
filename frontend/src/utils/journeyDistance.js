export const actualJourneyDistance = (journey) => {
  const value = journey.actual_distance_km;
  if (value == null || value === "") return null;
  const distance = Number(value);
  return Number.isFinite(distance) && distance >= 0 ? distance : null;
};

export const totalActualJourneyDistance = (journeys) => {
  const seen = new Set();
  let total = null;
  for (const journey of journeys) {
    const distance = actualJourneyDistance(journey);
    if (distance == null) continue;
    // Consolidated requests are started/completed together on the same vehicle.
    const key = journey.allocated_vehicle_id && journey.allocated_driver_id &&
      journey.journey_started_at && journey.journey_completed_at
      ? JSON.stringify([journey.allocated_vehicle_id, journey.allocated_driver_id,
        journey.journey_started_at, journey.journey_completed_at,
        journey.start_odometer_km, journey.end_odometer_km])
      : journey.id;
    if (seen.has(key)) continue;
    seen.add(key);
    total = (total ?? 0) + Math.round(distance * 100);
  }
  return total == null ? null : total / 100;
};

export const allocatedJourneyDistance = (journey) => {
  const value = journey.distance_km;
  if (value == null || value === "") return null;
  const distance = Number(value);
  return Number.isFinite(distance) && distance >= 0 ? Math.round(distance * 200) / 100 : null;
};

// Each request retains its own planned round trip, including consolidated members.
export const totalAllocatedJourneyDistance = (journeys) => {
  const distances = journeys.map(allocatedJourneyDistance).filter(value => value != null);
  return distances.length ? distances.reduce((sum, value) => sum + Math.round(value * 100), 0) / 100 : null;
};