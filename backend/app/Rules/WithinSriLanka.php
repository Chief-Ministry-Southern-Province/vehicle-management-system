<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WithinSriLanka implements ValidationRule
{
    private const COAST_TOLERANCE_DEGREES = 0.04;

    /**
     * Simplified, ordered outer coastline in [longitude, latitude] order.
     * The conservative ring retains narrow coastal areas and must not
     * self-intersect, or the point-in-polygon rule excludes valid locations.
     * Source: https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM0/ (ODbL).
     */
    private const BOUNDARY = [
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
