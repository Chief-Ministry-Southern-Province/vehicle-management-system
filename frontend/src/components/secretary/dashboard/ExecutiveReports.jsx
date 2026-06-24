const reports = [
  "Quarterly Fuel Audit",
  "Maintenance Forecast Q4",
  "Driver Efficiency Logs",
  "Departmental Spend",
];

export default function ExecutiveReports() {
  return (
    <div className="space-y-5">

      <div className="bg-white rounded-2xl border p-6">

        <h3 className="text-2xl font-bold mb-5">
          Executive Reports
        </h3>

        <div className="space-y-4">

          {reports.map((item) => (
            <div
              key={item}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">
                  {item}
                </h4>

                <p className="text-sm text-slate-500">
                  Generated Oct 2024
                </p>
              </div>

              <button className="border px-3 py-2 rounded-lg">
                View
              </button>
            </div>
          ))}

        </div>

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

        <p className="text-xs uppercase font-bold text-blue-600 mb-2">
          Automated Insights
        </p>

        <h4 className="font-bold text-lg mb-2">
          Fuel efficiency is up by 4.2%
        </h4>

        <p className="text-sm text-slate-600">
          Route optimization for Public Works saved approximately
          $1.2k this month.
        </p>

        <button className="mt-4 text-blue-600 font-semibold">
          Read Full Analysis →
        </button>

      </div>

    </div>
  );
}