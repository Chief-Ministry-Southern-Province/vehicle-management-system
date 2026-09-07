<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WithinSriLanka implements ValidationRule
{
    private const COAST_TOLERANCE_DEGREES = 0.04;

    /**
     * Simplified ADM0 mainland outline in [longitude, latitude] order.
     * Source: https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM0/ (ODbL).
     */
    private const BOUNDARY = [
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

    public function __construct(private readonly mixed $latitude) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_numeric($this->latitude) || ! is_numeric($value)) {
            return;
        }

        if (! self::contains((float) $this->latitude, (float) $value)) {
            $fail('The selected location must be within Sri Lanka.');
        }
    }

    public static function contains(float $latitude, float $longitude): bool
    {
        if ($latitude < 5.7 || $latitude > 10 || $longitude < 79.5 || $longitude > 82) {
            return false;
        }

        $inside = false;
        $previous = count(self::BOUNDARY) - 1;

        foreach (self::BOUNDARY as $index => $currentPoint) {
            $previousPoint = self::BOUNDARY[$previous];

            if (self::distanceToSegment([$longitude, $latitude], $previousPoint, $currentPoint) <= self::COAST_TOLERANCE_DEGREES) {
                return true;
            }

            $crossesLatitude = ($currentPoint[1] > $latitude) !== ($previousPoint[1] > $latitude);
            if ($crossesLatitude) {
                $intersectionLongitude = (($previousPoint[0] - $currentPoint[0]) * ($latitude - $currentPoint[1]))
                    / ($previousPoint[1] - $currentPoint[1]) + $currentPoint[0];
                if ($longitude < $intersectionLongitude) {
                    $inside = ! $inside;
                }
            }

            $previous = $index;
        }

        return $inside;
    }

    private static function distanceToSegment(array $point, array $start, array $end): float
    {
        $dx = $end[0] - $start[0];
        $dy = $end[1] - $start[1];

        if ($dx === 0.0 && $dy === 0.0) {
            return hypot($point[0] - $start[0], $point[1] - $start[1]);
        }

        $ratio = max(0, min(1, (($point[0] - $start[0]) * $dx + ($point[1] - $start[1]) * $dy) / ($dx * $dx + $dy * $dy)));
        $projectedLongitude = $start[0] + $ratio * $dx;
        $projectedLatitude = $start[1] + $ratio * $dy;

        return hypot($point[0] - $projectedLongitude, $point[1] - $projectedLatitude);
    }
}
