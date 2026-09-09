import { LOCAL_TIME_ZONE } from "./dateTime.js";
import { totalActualJourneyDistance, totalAllocatedJourneyDistance, totalExtraJourneyFuel } from "./journeyDistance.js";

const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: LOCAL_TIME_ZONE, year: "numeric", month: "2-digit",
});

export function monthlyFuelAnalysis(journeys) {
  const groups = new Map();
  for (const journey of journeys) {
    if (!journey.journey_completed_at) continue;
    const date = new Date(journey.journey_completed_at);
    if (Number.isNaN(date.getTime())) continue;
    const parts = Object.fromEntries(monthFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
    const month = `${parts.year}-${parts.month}`;
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month).push(journey);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([month, rows]) => ({
    month,
    allocated: totalAllocatedJourneyDistance(rows),
    actual: totalActualJourneyDistance(rows),
    extraFuel: totalExtraJourneyFuel(rows),
  }));
}
