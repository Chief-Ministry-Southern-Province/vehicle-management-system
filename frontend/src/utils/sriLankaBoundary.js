export const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

export const SRI_LANKA_VIEW_BOUNDS = {
  south: 5.7,
  west: 79.5,
  north: 10,
  east: 82,
};

// Simplified, ordered outer coastline derived from the ODbL geoBoundaries Sri
// Lanka dataset: https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM0/
// Coordinates use GeoJSON order: [longitude, latitude]. This conservative outer
// ring intentionally retains narrow coastal areas and must not self-intersect.
export const SRI_LANKA_BOUNDARY = [
  [80.23, 9.88], [80.50, 9.64], [80.72, 9.42], [80.93, 9.12],
  [81.13, 8.83], [81.28, 8.55], [81.42, 8.25], [81.57, 7.95],
  [81.72, 7.70], [81.84, 7.45], [81.88, 7.15], [81.84, 6.88],
  [81.71, 6.60], [81.52, 6.38], [81.30, 6.22], [81.08, 6.12],
  [80.80, 6.02], [80.52, 5.94], [80.25, 5.96], [80.06, 6.10],
  [79.93, 6.35], [79.84, 6.65], [79.80, 6.98], [79.78, 7.30],
  [79.75, 7.62], [79.70, 8.10], [79.73, 8.35], [79.80, 8.60],
  [79.86, 8.88], [79.89, 9.15], [79.90, 9.42], [79.92, 9.65],
  [80.05, 9.82], [80.23, 9.88],
];

const COAST_TOLERANCE_DEGREES = 0.04;

function distanceToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const ratio = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + ratio * dx), point[1] - (start[1] + ratio * dy));
}

export function isWithinSriLanka({ lat, lng }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < SRI_LANKA_VIEW_BOUNDS.south || lat > SRI_LANKA_VIEW_BOUNDS.north
    || lng < SRI_LANKA_VIEW_BOUNDS.west || lng > SRI_LANKA_VIEW_BOUNDS.east) return false;

  let inside = false;
  for (let index = 0, previous = SRI_LANKA_BOUNDARY.length - 1; index < SRI_LANKA_BOUNDARY.length; previous = index, index += 1) {
    const currentPoint = SRI_LANKA_BOUNDARY[index];
    const previousPoint = SRI_LANKA_BOUNDARY[previous];
    if (distanceToSegment([lng, lat], previousPoint, currentPoint) <= COAST_TOLERANCE_DEGREES) return true;
    const crossesLatitude = (currentPoint[1] > lat) !== (previousPoint[1] > lat);
    if (crossesLatitude) {
      const intersectionLongitude = ((previousPoint[0] - currentPoint[0]) * (lat - currentPoint[1]))
        / (previousPoint[1] - currentPoint[1]) + currentPoint[0];
      if (lng < intersectionLongitude) inside = !inside;
    }
  }
  return inside;
}

export function clampToSriLankaView({ lat, lng }) {
  return {
    lat: Math.max(SRI_LANKA_VIEW_BOUNDS.south, Math.min(SRI_LANKA_VIEW_BOUNDS.north, lat)),
    lng: Math.max(SRI_LANKA_VIEW_BOUNDS.west, Math.min(SRI_LANKA_VIEW_BOUNDS.east, lng)),
  };
}
