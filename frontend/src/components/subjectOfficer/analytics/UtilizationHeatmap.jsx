const days = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

export default function UtilizationHeatmap() {
  return (
    <div className="bg-white rounded-2xl border p-6">

      <div className="flex justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Interactive Utilization Heatmap
          </h2>

          <p className="text-gray-500 text-sm">
            Visualizing vehicle demand by day and time.
          </p>
        </div>

      </div>

      <div className="space-y-3">

        {days.map((day) => (
          <div
            key={day}
            className="flex items-center gap-2"
          >
            <span className="w-10 text-xs font-medium">
              {day}
            </span>

            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded ${
                  Math.random() > 0.5
                    ? "bg-blue-500"
                    : "bg-blue-100"
                }`}
              />
            ))}
          </div>
        ))}

      </div>

    </div>
  );
}