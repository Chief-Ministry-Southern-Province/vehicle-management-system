export default function RecommendationInfoCards() {
  return (
    <div className="grid md:grid-cols-2 gap-5">

      <div className="bg-blue-50 rounded-xl p-5">
        <h3 className="font-semibold text-blue-700">
          Recommendation Policy
        </h3>

        <p className="text-sm text-gray-600 mt-2">
          All requests must be reviewed within 48 hours
          of submission. Ensure justification notes
          are included for rejected requests.
        </p>
      </div>

      <div className="bg-green-50 rounded-xl p-5">
        <h3 className="font-semibold text-green-700">
          Fleet Status Update
        </h3>

        <p className="text-sm text-gray-600 mt-2">
          85% fleet utilization. High-priority requests
          should be prioritized over routine travel.
        </p>
      </div>

    </div>
  );
}