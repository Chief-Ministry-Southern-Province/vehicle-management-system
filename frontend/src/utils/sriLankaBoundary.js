export const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

export const SRI_LANKA_VIEW_BOUNDS = {
  south: 5.7,
  west: 79.5,
  north: 10,
  east: 82,
};

// Simplified ADM0 mainland outline derived from the ODbL geoBoundaries Sri Lanka dataset:
// https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM0/
// Coordinates use GeoJSON order: [longitude, latitude].
export const SRI_LANKA_BOUNDARY = [
  [80.21208, 9.83579], [79.93954, 9.69614], [80.124, 9.60822],
  [80.37199, 9.53142], [80.30589, 9.44996], [80.24057, 9.5203],
  [80.08297, 9.40464], [80.07541, 9.12459], [79.91782, 8.9271],
  [79.91578, 8.5485], [79.80447, 8.22368], [79.81934, 7.99706],
  [79.72879, 8.13761], [79.73781, 8.24116], [79.77933, 8.3558],
  [79.79252, 7.60827], [79.86776, 7.11173], [79.86805, 6.99717],
  [79.84454, 6.95516], [79.97739, 6.45628], [80.09757, 6.14497],
  [80.23484, 6.01739], [80.46724, 5.94093], [80.6397, 5.94593],
  [80.73207, 5.97807], [80.86672, 6.04692], [81.12659, 6.12597],
  [81.42775, 6.27996], [81.7291, 6.54808], [81.86791, 6.97244],
  [81.61989, 7.82884], [81.49123, 8.01218], [81.29256, 8.5074],
  [81.14561, 8.49449], [81.20125, 8.53493], [81.22182, 8.58157],
  [81.22546, 8.65322], [80.95988, 8.97652], [80.92434, 9.00704],
  [80.71694, 9.3615], [80.21208, 9.83579],
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
