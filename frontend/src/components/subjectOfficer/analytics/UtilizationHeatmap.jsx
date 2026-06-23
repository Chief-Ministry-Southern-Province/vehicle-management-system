const days = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

const utilizationData = [
  [1, 2, 3, 2, 4, 4, 3, 2, 1, 1, 2, 3, 4, 3, 2, 2, 1, 1],
  [1, 1, 2, 3, 4, 4, 4, 3, 2, 2, 3, 4, 4, 4, 3, 2, 2, 1],
  [2, 2, 3, 4, 4, 4, 3, 2, 2, 2, 3, 4, 4, 4, 3, 3, 2, 1],
  [1, 2, 3, 4, 4, 3, 2, 2, 2, 3, 4, 4, 4, 3, 2, 2, 1, 1],
  [2, 3, 4, 4, 4, 4, 3, 3, 2, 3, 4, 4, 4, 4, 3, 2, 2, 1],
  [1, 1, 2, 2, 3, 3, 2, 2, 1, 1, 2, 3, 3, 2, 2, 1, 1, 1],
  [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1],
];

const getColor = (level) => {
  switch (level) {
    case 1:
      return "bg-blue-100";
    case 2:
      return "bg-blue-300";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-blue-700";
    default:
      return "bg-slate-100";
  }
};

export default function UtilizationHeatmap() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Fleet Utilization Heatmap
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Vehicle demand intensity by day and operating hour.
          </p>

        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">

          <span className="text-slate-500">
            Low
          </span>

          <div className="h-3 w-3 rounded bg-blue-100" />
          <div className="h-3 w-3 rounded bg-blue-300" />
          <div className="h-3 w-3 rounded bg-blue-500" />
          <div className="h-3 w-3 rounded bg-blue-700" />

          <span className="text-slate-500">
            High
          </span>

        </div>

      </div>

      {/* Time Labels */}
      <div className="mb-3 flex pl-12 text-[10px] text-slate-400">

        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="w-8 text-center"
          >
            {i + 6}
          </div>
        ))}

      </div>

      {/* Heatmap */}
      <div className="space-y-2">

        {days.map((day, rowIndex) => (
          <div
            key={day}
            className="flex items-center gap-2"
          >

            <span className="w-10 text-xs font-semibold text-slate-600">
              {day}
            </span>

            {utilizationData[rowIndex].map(
              (value, colIndex) => (
                <div
                  key={colIndex}
                  title={`${day} - Demand Level ${value}`}
                  className={`h-8 w-8 rounded-lg transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-300 ${getColor(
                    value
                  )}`}
                />
              )
            )}

          </div>
        ))}

      </div>

      {/* Footer Insights */}
      <div className="mt-6 border-t border-slate-100 pt-5">

        <div className="grid grid-cols-3 gap-4">

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Peak Day
            </p>

            <h4 className="mt-1 font-semibold text-slate-900">
              Friday
            </h4>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Peak Hours
            </p>

            <h4 className="mt-1 font-semibold text-slate-900">
              10:00 - 14:00
            </h4>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Utilization Rate
            </p>

            <h4 className="mt-1 font-semibold text-blue-600">
              72.4%
            </h4>

          </div>

        </div>

      </div>

    </div>
  );
}