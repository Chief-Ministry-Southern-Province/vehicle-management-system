export default function ActivityTimeline() {
  return (
    <div className="bg-white border rounded-xl p-6">

      <h2 className="font-semibold text-lg mb-5">
        Recent Department Activity
      </h2>

      <div className="grid md:grid-cols-4 gap-5">

        <div className="border-l-2 border-blue-500 pl-4">
          <p className="text-xs text-gray-400">
            10 MINS AGO
          </p>

          <p className="mt-2">
            Officer Miller recommended REQ-9012
          </p>
        </div>

        <div className="border-l-2 border-blue-500 pl-4">
          <p className="text-xs text-gray-400">
            1 HOUR AGO
          </p>

          <p className="mt-2">
            New vehicle request submitted by HR Team
          </p>
        </div>

        <div className="border-l-2 border-blue-500 pl-4">
          <p className="text-xs text-gray-400">
            3 HOURS AGO
          </p>

          <p className="mt-2">
            REQ-8940 finalized by Secretary
          </p>
        </div>

        <div className="border-l-2 border-blue-500 pl-4">
          <p className="text-xs text-gray-400">
            YESTERDAY
          </p>

          <p className="mt-2">
            Monthly fuel usage report generated
          </p>
        </div>

      </div>

    </div>
  );
}