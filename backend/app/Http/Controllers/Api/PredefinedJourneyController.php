<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PredefinedJourney;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PredefinedJourneyController extends Controller
{
    public function index(): JsonResponse
    {
        $journeys = PredefinedJourney::query()
            ->with('creator:id,name')
            ->orderBy('name')
            ->get();

        return response()->json(['success' => true, 'data' => ['journeys' => $journeys]]);
    }

    public function store(Request $request): JsonResponse
    {
        $journey = PredefinedJourney::create([
            ...$this->validatedJourney($request),
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pre-defined journey created successfully.',
            'data' => ['journey' => $journey->load('creator:id,name')],
        ], 201);
    }

    public function update(Request $request, PredefinedJourney $predefinedJourney): JsonResponse
    {
        $predefinedJourney->update($this->validatedJourney($request));

        return response()->json([
            'success' => true,
            'message' => 'Pre-defined journey updated successfully.',
            'data' => ['journey' => $predefinedJourney->fresh()->load('creator:id,name')],
        ]);
    }

    public function destroy(PredefinedJourney $predefinedJourney): JsonResponse
    {
        $predefinedJourney->delete();

        return response()->json(['success' => true, 'message' => 'Pre-defined journey deleted successfully.']);
    }

    private function validatedJourney(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'starting_location' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'distance_km' => ['required', 'numeric', 'gt:0', 'max:99999.99'],
        ]);
    }
}
