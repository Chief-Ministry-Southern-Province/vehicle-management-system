export default function TechnicalInfo() {
  return (
    <>
      <div className="bg-white border rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-6">
          Technical Specifications
        </h3>

        <div className="space-y-5">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Engine Type
            </span>

            <span className="font-semibold">
              2.5L Hybrid
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Fuel Capacity
            </span>

            <span className="font-semibold">
              50 Liters
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Transmission
            </span>

            <span className="font-semibold">
              eCVT Automatic
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              VIN Number
            </span>

            <span className="font-semibold">
              JTM1234567890ABC
            </span>
          </div>

        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-5">
          Compliance & Insurance
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-600">
              Insurance Expiry
            </span>

            <span className="font-semibold">
              30 Dec 2024
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">
              Logbook Status
            </span>

            <span className="font-semibold text-blue-600">
              Digitized (Verified)
            </span>
          </div>

        </div>

      </div>
    </>
  );
}