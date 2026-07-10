export default function RequestOverview() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">

      <div className="p-5 border-b">
        <h3 className="font-bold text-xl">
          Request Overview
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8 p-6">

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Requester
          </p>
          <h4 className="font-semibold mt-1">
            Hon. Sarah Ahmed
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Department
          </p>
          <h4 className="font-semibold mt-1">
            Ministry of External Affairs
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Passengers
          </p>
          <h4 className="font-semibold mt-1">
            4 Officials
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Estimated Distance
          </p>
          <h4 className="font-semibold mt-1">
            120km Total
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Distance
          </p>

          <span className="text-gray-600 font-medium">
            Galle distric office
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase">
            Timeline
          </p>

          <h4 className="font-semibold mt-1">
            Tomorrow, 08:00 AM - 06:00 PM
          </h4>
        </div>

      </div>

    </div>
  );
}