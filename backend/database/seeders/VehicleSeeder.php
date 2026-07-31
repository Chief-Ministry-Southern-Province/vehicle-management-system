<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /** Seed the government fleet with representative vehicle records. */
    public function run(): void
    {
        Vehicle::query()->delete();

        foreach ($this->vehicles() as $vehicle) {
            $vehicle['seat_capacity'] = $this->seatCapacities()[$vehicle['registration_number']];

            Vehicle::create($vehicle);
        }
    }

    /** @return array<string, int> */
    private function seatCapacities(): array
    {
        return [
            'GV-1001' => 7, 'GV-1002' => 5, 'GV-1003' => 5, 'GV-1004' => 14, 'GV-1005' => 7,
            'GV-1006' => 35, 'GV-1007' => 5, 'GV-1008' => 5, 'GV-1009' => 7, 'GV-1010' => 15,
            'GV-1011' => 5, 'GV-1012' => 5, 'GV-1013' => 5, 'GV-1014' => 28, 'GV-1015' => 8,
            'GV-1016' => 5, 'GV-1017' => 5, 'GV-1018' => 5, 'GV-1019' => 11, 'GV-1020' => 5,
            'GV-1021' => 7, 'GV-1022' => 40, 'GV-1023' => 5, 'GV-1024' => 30, 'GV-1025' => 5,
            'GV-1026' => 5, 'GV-1027' => 5, 'GV-1028' => 30, 'GV-1029' => 12, 'GV-1030' => 7,
        ];
    }

    /** @return array<int, array<string, mixed>> */
    private function vehicles(): array
    {
        $specifications = [
            ['GV-1001', 'SUV', 'Toyota', 'Land Cruiser 300', 2024, 'Pearl White', 'Diesel', 110, 'Executive Secretariat', 'available'],
            ['GV-1002', 'Sedan', 'Honda', 'Civic', 2023, 'Crystal Black', 'Petrol', 47, 'Finance Division', 'available'],
            ['GV-1003', 'Pickup', 'Ford', 'Ranger Wildtrak', 2024, 'Meteor Grey', 'Diesel', 80, 'Infrastructure Unit', 'on_hold'],
            ['GV-1004', 'Van', 'Toyota', 'Hiace Commuter', 2023, 'White', 'Diesel', 70, 'Staff Transport Unit', 'available'],
            ['GV-1005', 'SUV', 'Nissan', 'X-Trail e-Power', 2024, 'Champagne Silver', 'Hybrid', 55, 'Regional Administration', 'available'],
            ['GV-1006', 'Bus', 'Ashok Leyland', 'Oyster Wide', 2022, 'Royal Blue', 'Diesel', 185, 'Staff Transport Unit', 'maintenance'],
            ['GV-1007', 'Sedan', 'Toyota', 'Corolla Hybrid', 2024, 'Silver Metallic', 'Hybrid', 43, 'Planning Division', 'available'],
            ['GV-1008', 'Pickup', 'Isuzu', 'D-Max V-Cross', 2023, 'Splash White', 'Diesel', 76, 'Engineering Division', 'available'],
            ['GV-1009', 'SUV', 'Kia', 'Sorento', 2023, 'Aurora Black', 'Diesel', 67, 'Policy Coordination', 'unavailable'],
            ['GV-1010', 'Van', 'Nissan', 'Urvan Premium', 2022, 'Brilliant Silver', 'Diesel', 65, 'ICT Support Unit', 'available'],
            ['GV-1011', 'Sedan', 'Hyundai', 'Elantra', 2023, 'Cyber Grey', 'Petrol', 47, 'Procurement Division', 'available'],
            ['GV-1012', 'SUV', 'Mazda', 'CX-5', 2023, 'Soul Red', 'Petrol', 56, 'Monitoring Unit', 'available'],
            ['GV-1013', 'Pickup', 'Mitsubishi', 'Triton Athlete', 2024, 'Graphite Grey', 'Diesel', 75, 'Disaster Response Unit', 'available'],
            ['GV-1014', 'Bus', 'Tata', 'Starbus Ultra', 2022, 'Ivory White', 'Diesel', 160, 'Field Operations Unit', 'maintenance'],
            ['GV-1015', 'Van', 'Toyota', 'Noah Hybrid', 2023, 'Pearl White', 'Hybrid', 50, 'Registry Division', 'available'],
            ['GV-1016', 'Sedan', 'Nissan', 'Sylphy', 2022, 'Gun Metallic', 'Petrol', 52, 'Protocol Office', 'available'],
            ['GV-1017', 'SUV', 'Suzuki', 'Grand Vitara', 2024, 'Opulent Red', 'Hybrid', 47, 'District Coordination', 'unavailable'],
            ['GV-1018', 'Pickup', 'Toyota', 'Hilux GR Sport', 2024, 'Super White', 'Diesel', 80, 'Facilities Management', 'available'],
            ['GV-1019', 'Van', 'Hyundai', 'Staria', 2023, 'Shimmering Silver', 'Diesel', 75, 'Central Stores', 'available'],
            ['GV-1020', 'Sedan', 'Skoda', 'Octavia', 2023, 'Magic Black', 'Petrol', 50, 'Internal Audit Division', 'available'],
            ['GV-1021', 'SUV', 'Mitsubishi', 'Pajero Sport', 2024, 'White Diamond', 'Diesel', 68, 'Assistance Secreatry Office', 'available'],
            ['GV-1022', 'Bus', 'Ashok Leyland', 'Viking BS6', 2023, 'Ocean Blue', 'Diesel', 200, 'Staff Transport Unit', 'available'],
            ['GV-1023', 'Pickup', 'Mahindra', 'Pik Up S11', 2022, 'Rocky Beige', 'Diesel', 80, 'Rural Development Unit', 'maintenance'],
            ['GV-1024', 'Van', 'Toyota', 'Coaster', 2023, 'White', 'Diesel', 95, 'Training Division', 'available'],
            ['GV-1025', 'Sedan', 'Honda', 'Accord Hybrid', 2024, 'Meteoroid Grey', 'Hybrid', 48, 'Legal Division', 'available'],
            ['GV-1026', 'SUV', 'Hyundai', 'Santa Fe', 2023, 'Typhoon Silver', 'Diesel', 67, 'Project Management Unit', 'unavailable'],
            ['GV-1027', 'Pickup', 'Nissan', 'Navara Pro-4X', 2024, 'Forged Metallic', 'Diesel', 80, 'Public Works Division', 'available'],
            ['GV-1028', 'Bus', 'Tata', 'LP 912', 2022, 'Arctic White', 'Diesel', 150, 'Community Relations Unit', 'available'],
            ['GV-1029', 'Van', 'Nissan', 'NV350 Caravan', 2023, 'Dark Metal Grey', 'Diesel', 65, 'Digital Services Unit', 'available'],
            ['GV-1030', 'SUV', 'Ford', 'Everest Titanium', 2024, 'Absolute Black', 'Diesel', 80, 'Emergency Operations Centre', 'available'],
        ];

        return array_map(function (array $specification, int $index): array {
            [$registration, $type, $make, $model, $year, $color, $fuel, $fuelCapacity, $assignment, $status] = $specification;
            $number = str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            return [
                'registration_number' => $registration,
                'vehicle_type' => $type,
                'make' => $make,
                'model' => $model,
                'manufacturing_year' => $year,
                'color' => $color,
                'vin' => "GOVLK2026FLEET{$number}",
                'engine_number' => "ENG-2026-{$number}",
                'fuel_type' => $fuel,
                'fuel_capacity' => $fuelCapacity,
                'technical_notes' => "New government fleet vehicle allocated to {$assignment}.",
                'registration_expiry' => '2028-' . str_pad((string) (($index % 12) + 1), 2, '0', STR_PAD_LEFT) . '-15',
                'revenue_license_expiry' => '2028-' . str_pad((string) (($index % 12) + 1), 2, '0', STR_PAD_LEFT) . '-15',
                'insurance_policy' => "GOV-MOTOR-2026-{$number}",
                'insurance_provider' => ['Sri Lanka Insurance', 'Ceylinco General', 'Allianz Insurance'][$index % 3],
                'assignment' => $assignment,
                'status' => $status === 'on_hold' ? 'unavailable' : $status,
                'last_service_date' => null,
                'fuel_level' => 55 + ($index % 10) * 4,
                'service_category' => in_array($type, ['Bus', 'Van'], true) ? 'Staff Transport' : 'Government Operations',
                'service_details' => [],
            ];
        }, $specifications, array_keys($specifications));
    }
}
