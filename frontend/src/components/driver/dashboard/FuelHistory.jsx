const fuelLogs = [
  {
    qty: "45.2 L",
    station: "Shell Global",
    date: "Oct 24",
    amount: "$62.10",
  },
  {
    qty: "38.0 L",
    station: "Gov Station #4",
    date: "Oct 18",
    amount: "$51.30",
  },
  {
    qty: "42.5 L",
    station: "Texaco HQ",
    date: "Oct 10",
    amount: "$58.20",
  },
];

export default function FuelHistory() {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <div className="flex justify-between mb-5">
        <h3 className="font-bold">
          Fuel History
        </h3>

        <button>+</button>
      </div>

      <div className="space-y-4">

        {fuelLogs.map((item) => (
          <div
            key={item.date}
            className="border-b pb-3"
          >
            <div className="flex justify-between">

              <div>
                <h4 className="font-semibold">
                  {item.qty}
                </h4>

                <p className="text-xs text-slate-500">
                  {item.station}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs">{item.date}</p>

                <p className="font-semibold text-blue-600">
                  {item.amount}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}