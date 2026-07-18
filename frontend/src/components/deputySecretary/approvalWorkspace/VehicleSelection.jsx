const vehicles = [
  {
    name: "Toyota Land Cruiser",
    fuel: "85%",
    location: "Central Pool",
    status: "Available",
  },
  {
    name: "Mercedes S-Class",
    fuel: "92%",
    location: "Executive Wing",
    status: "Available",
  },
  {
    name: "Ford Everest",
    fuel: "45%",
    location: "Maintenance",
    status: "In Service",
  },
];

export default function VehicleSelection() {
  return (
    <div className="bg-white border rounded-2xl">
      <div className="p-5 border-b">
        <h3 className="font-bold text-xl">Select Vehicle</h3>
      </div>

      <div className="p-4 space-y-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.name}
            className="border rounded-xl p-4 hover:border-blue-500 cursor-pointer"
          >
            <div className="flex justify-between">
              <h4 className="font-semibold">{vehicle.name}</h4>

              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                {vehicle.status}
              </span>
            </div>

            <div className="flex gap-8 mt-3 text-sm text-gray-500">
              <span>Fuel {vehicle.fuel}</span>
              <span>{vehicle.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
