import { FiTruck } from "react-icons/fi";

export default function BasicInformation() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <FiTruck className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Basic Identification
          </h2>

          <p className="text-gray-500 text-sm">
            General details used to identify the vehicle in the fleet.
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            License Plate Number
          </label>

          <input
            type="text"
            placeholder="e.g. GV-1234-B"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Vehicle Category
          </label>

          <select className="w-full border rounded-xl px-4 py-3">
            <option>Executive Sedan</option>
            <option>SUV</option>
            <option>Van</option>
            <option>Pickup</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Manufacturer / Make
          </label>

          <input
            type="text"
            placeholder="Toyota"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Model Name
          </label>

          <input
            type="text"
            placeholder="Camry Hybrid"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Color Description
          </label>

          <input
            type="text"
            placeholder="Pearl White Metallic"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

      </div>

    </div>
  );
}