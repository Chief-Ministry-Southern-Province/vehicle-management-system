import {
  FiCpu,
  FiDroplet,
  FiSettings,
  FiHash,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

export default function TechnicalInfo() {
  const specs = [
    {
      icon: <FiCpu size={16} />,
      label: "Engine Type",
      value: "2.5L Hybrid",
    },
    {
      icon: <FiDroplet size={16} />,
      label: "Fuel Capacity",
      value: "50 Liters",
    },
    {
      icon: <FiSettings size={16} />,
      label: "Transmission",
      value: "eCVT Automatic",
    },
    {
      icon: <FiHash size={16} />,
      label: "VIN Number",
      value: "JTM1234567890ABC",
    },
  ];

  return (
    <div className="space-y-4">

      {/* Technical Specifications */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Technical Specifications
          </h3>
        </div>

        <div className="p-5 space-y-4">

          {specs.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  {item.icon}
                </div>

                <span className="text-sm text-slate-500">
                  {item.label}
                </span>

              </div>

              <span className="font-medium text-sm text-slate-800">
                {item.value}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* Compliance Card */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm">

        <div className="border-b border-blue-100 px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <FiShield className="text-blue-600" />
            Compliance & Insurance
          </h3>
        </div>

        <div className="p-5 space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Insurance Expiry
            </span>

            <span className="font-medium text-slate-800">
              30 Dec 2026
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Logbook Status
            </span>

            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <FiCheckCircle size={12} />
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Registration
            </span>

            <span className="text-sm font-medium text-green-600">
              Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}