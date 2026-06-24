const drivers = [
  {
    name: "Robert Wilson",
    exp: "12 yrs",
    rating: "4.9",
    status: "Available",
  },
  {
    name: "David Chen",
    exp: "8 yrs",
    rating: "4.7",
    status: "On Trip",
  },
  {
    name: "Maria Garcia",
    exp: "10 yrs",
    rating: "4.8",
    status: "Available",
  },
];

export default function DriverAssignment() {
  return (
    <div className="bg-white border rounded-2xl">

      <div className="p-5 border-b">
        <h3 className="font-bold text-xl">
          Assign Driver
        </h3>
      </div>

      <div className="p-4 space-y-3">

        {drivers.map((driver) => (
          <div
            key={driver.name}
            className="border rounded-xl p-4 flex justify-between"
          >
            <div>
              <h4 className="font-semibold">
                {driver.name}
              </h4>

              <p className="text-sm text-gray-500">
                {driver.exp} Experience • ⭐ {driver.rating}
              </p>
            </div>

            <span className="text-xs border rounded-full px-3 py-1 h-fit">
              {driver.status}
            </span>
          </div>
        ))}

      </div>

      <div className="p-4">
        <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
          Approval will notify Driver and Ground Security Team immediately.
        </div>
      </div>

    </div>
  );
}