const drivers = [
  "Samuel Okoro",
  "Anish Gupta",
  "Linda Blair",
];

export default function StandbyDrivers() {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <h3 className="font-bold text-lg mb-4">
        Drivers on Standby
      </h3>

      <div className="space-y-3">

        {drivers.map((driver) => (
          <div
            key={driver}
            className="border rounded-xl p-3 flex justify-between"
          >
            <div>
              <h4 className="font-medium">
                {driver}
              </h4>

              <p className="text-xs text-gray-500">
                Executive Driver
              </p>
            </div>

            <span className="text-xs border px-2 py-1 rounded-full">
              Standby
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}