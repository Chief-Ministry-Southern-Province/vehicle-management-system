import {
  FiDollarSign,
  FiClock,
  FiFileText,
} from "react-icons/fi";

export default function RepairSidebar() {
  return (
    <div className="bg-white border rounded-xl p-6">

      <h2 className="text-2xl font-bold">
        GV-8842
      </h2>

      <p className="text-gray-500 mt-1">
        Toyota Hilux
      </p>

      <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
        In Progress
      </span>

      <div className="grid grid-cols-2 gap-3 mt-6">

        <div className="border rounded-xl p-4">
          <FiDollarSign className="text-blue-500 mb-2" />
          <p className="text-xs text-gray-500">
            Total Cost
          </p>
          <h3 className="text-xl font-bold">
            $775
          </h3>
        </div>

        <div className="border rounded-xl p-4">
          <FiClock className="text-blue-500 mb-2" />
          <p className="text-xs text-gray-500">
            Downtime
          </p>
          <h3 className="text-xl font-bold">
            5 Days
          </h3>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold mb-3">
          Repair Summary
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          Complete engine teardown required due to severe
          overheating. Cylinder head resurfacing and gasket
          replacement underway.
        </p>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold mb-3">
          Cost Breakdown
        </h3>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Spare Parts</span>
            <span>$450</span>
          </div>

          <div className="flex justify-between">
            <span>Labor Fees</span>
            <span>$280</span>
          </div>

          <div className="flex justify-between">
            <span>Tax / Levy</span>
            <span>$45</span>
          </div>

          <hr />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>$775</span>
          </div>

        </div>
      </div>

      <div className="mt-8">

        <h3 className="font-semibold mb-3">
          Documentation
        </h3>

        <div className="space-y-3">

          <div className="border rounded-lg p-3 flex gap-3">
            <FiFileText />
            <div>
              <p className="text-sm font-medium">
                Damage_Photo_Front.jpg
              </p>
              <p className="text-xs text-gray-500">
                Uploaded Oct 12, 2023
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex gap-3">
            <FiFileText />
            <div>
              <p className="text-sm font-medium">
                Workshop_Invoice_4492.pdf
              </p>
              <p className="text-xs text-gray-500">
                Certified Document
              </p>
            </div>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">

        <button className="bg-blue-600 text-white py-3 rounded-xl font-medium">
          Approve Invoice
        </button>

        <button className="border py-3 rounded-xl font-medium">
          Contact Workshop
        </button>

      </div>

    </div>
  );
}