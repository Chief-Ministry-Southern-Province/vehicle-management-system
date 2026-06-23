const fleet = [
  "Toyota Land Cruiser",
  "Honda Civic",
  "Isuzu NPR",
];

export default function AvailableFleet() {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <h3 className="font-bold text-lg mb-4">
        Available Fleet
      </h3>

      <div className="space-y-3">

        {fleet.map((vehicle) => (
          <div
            key={vehicle}
            className="border rounded-xl p-3 flex justify-between"
          >
            <div>
              <h4 className="font-medium">
                {vehicle}
              </h4>

              <p className="text-xs text-gray-500">
                Ready for allocation
              </p>
            </div>

            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
              Available
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}