import { FiTruck } from "react-icons/fi";

const vehicles = [
  "KAA123A","KAB456B","KAC789C","KAD012D",
  "KAE345E","KAF678F","KAG901G","KAH234H",
  "KAI567I","KAJ890J","KAK123K","KAL456L",
  "KAM789M","KAN012N","KAO345O","KAP678P"
];

export default function FleetStatusGrid() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex justify-between mb-6">

        <div>
          <h2 className="text-2xl font-semibold">
            Fleet Status Grid
          </h2>

          <p className="text-gray-500">
            Visual map of vehicle availability
          </p>
        </div>

      </div>

      <div className="grid grid-cols-4 gap-3">

        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle}
            className={`border rounded-xl p-3 text-center ${
              index % 5 === 0
                ? "border-red-300 bg-red-50"
                : "hover:bg-gray-50"
            }`}
          >
            <FiTruck className="mx-auto mb-2" />
            <p className="text-xs">{vehicle}</p>
          </div>
        ))}

      </div>

    </div>
  );
}