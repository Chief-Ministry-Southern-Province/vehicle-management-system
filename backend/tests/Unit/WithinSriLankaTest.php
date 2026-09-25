<?php

namespace Tests\Unit;

use App\Rules\WithinSriLanka;
use PHPUnit\Framework\TestCase;

class WithinSriLankaTest extends TestCase
{
    public function test_it_accepts_locations_across_the_island(): void
    {
        foreach ([
            'Mannar' => [8.981, 79.904],
            'Puttalam' => [8.039, 79.828],
            'Anuradhapura' => [8.311, 80.403],
            'Galle' => [6.053, 80.221],
            'Matara' => [5.949, 80.546],
            'Dondra' => [5.926, 80.590],
            'Tangalle' => [6.024, 80.797],
            'Hambantota' => [6.124, 81.118],
            'Yala' => [6.372, 81.507],
            'Batticaloa' => [7.717, 81.700],
            'Jaffna' => [9.661, 80.025],
        ] as $place => [$latitude, $longitude]) {
            $this->assertTrue(
                WithinSriLanka::contains($latitude, $longitude),
                "Expected {$place} to be inside the Sri Lanka boundary."
            );
        }
    }

    public function test_it_rejects_a_location_outside_sri_lanka(): void
    {
        $this->assertFalse(WithinSriLanka::contains(10.4, 79.8));
    }

    public function test_its_outline_has_no_crossing_edges(): void
    {
        $boundaries = (new \ReflectionClass(WithinSriLanka::class))
            ->getReflectionConstant('BOUNDARIES')
            ->getValue();

        foreach ($boundaries as $ringIndex => $boundary) {
            $edgeCount = count($boundary) - 1;

            for ($first = 0; $first < $edgeCount; $first += 1) {
                for ($second = $first + 1; $second < $edgeCount; $second += 1) {
                    if ($second === $first + 1 || ($first === 0 && $second === $edgeCount - 1)) {
                        continue;
                    }

                    $this->assertFalse(
                        $this->edgesCross(
                            $boundary[$first],
                            $boundary[$first + 1],
                            $boundary[$second],
                            $boundary[$second + 1],
                        ),
                        "Boundary {$ringIndex} edges {$first} and {$second} cross."
                    );
                }
            }
        }
    }

    public function test_the_frontend_uses_the_same_boundary_coordinates(): void
    {
        $frontendSource = file_get_contents(dirname(__DIR__, 3).'/frontend/src/utils/sriLankaBoundary.js');
        $this->assertNotFalse($frontendSource);
        $this->assertSame(1, preg_match(
            '/SRI_LANKA_BOUNDARIES = \\[(.*?)\\];\\R\\R\/\/ Retained/s',
            $frontendSource,
            $matches,
        ));
        preg_match_all('/\\[[0-9.]+, [0-9.]+\\]/', $matches[1], $frontendCoordinates);

        $backendCoordinates = array_map(
            static fn (array $point): string => sprintf('[%.6F, %.6F]', $point[0], $point[1]),
            array_merge(...(new \ReflectionClass(WithinSriLanka::class))
                ->getReflectionConstant('BOUNDARIES')
                ->getValue()),
        );

        $this->assertSame($backendCoordinates, $frontendCoordinates[0]);
    }

    public function test_the_map_does_not_draw_the_generalized_boundary_mask(): void
    {
        $mapSource = file_get_contents(dirname(__DIR__, 3).'/frontend/src/components/employee/LocationMapPicker.jsx');

        $this->assertNotFalse($mapSource);
        $this->assertStringNotContainsString('SRI_LANKA_BOUNDARIES', $mapSource);
        $this->assertStringNotContainsString('boundaryPath', $mapSource);
    }

    private function edgesCross(array $firstStart, array $firstEnd, array $secondStart, array $secondEnd): bool
    {
        $orientation = static fn (array $origin, array $first, array $second): float =>
            ($first[0] - $origin[0]) * ($second[1] - $origin[1])
            - ($first[1] - $origin[1]) * ($second[0] - $origin[0]);

        $firstSecondStart = $orientation($firstStart, $firstEnd, $secondStart);
        $firstSecondEnd = $orientation($firstStart, $firstEnd, $secondEnd);
        $secondFirstStart = $orientation($secondStart, $secondEnd, $firstStart);
        $secondFirstEnd = $orientation($secondStart, $secondEnd, $firstEnd);

        return $firstSecondStart * $firstSecondEnd < 0
            && $secondFirstStart * $secondFirstEnd < 0;
    }
}
