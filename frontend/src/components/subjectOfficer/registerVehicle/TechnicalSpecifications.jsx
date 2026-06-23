import { FiSettings } from "react-icons/fi";

export default function TechnicalSpecifications() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <FiSettings className="text-blue-600" />

        <div>
          <h2 className="text-2xl font-bold">
            Technical Specifications
          </h2>

          <p className="text-gray-500 text-sm">
            Engine details, chassis information and fuel capacities.
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          placeholder="17-character VIN"
          className="border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Engine Number"
          className="border rounded-xl px-4 py-3"
        />

        <select className="border rounded-xl px-4 py-3">
          <option>Petrol (Octane 95)</option>
          <option>Diesel</option>
          <option>Hybrid</option>
          <option>Electric</option>
        </select>

        <input
          placeholder="Fuel Tank Capacity (L)"
          className="border rounded-xl px-4 py-3"
        />

        <div className="md:col-span-2">

          <textarea
            rows={5}
            placeholder="Additional technical notes..."
            className="w-full border rounded-xl p-4"
          />

        </div>

      </div>

    </div>
  );
}