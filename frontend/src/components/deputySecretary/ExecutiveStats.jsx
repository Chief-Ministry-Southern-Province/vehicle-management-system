import {
  FiFileText,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    title: "Requests Pending Approval",
    value: "12",
    icon: <FiFileText />,
    note: "+14% Needs your attention",
  },
  {
    title: "Vehicles for Allocation",
    value: "08",
    icon: <FiTruck />,
    note: "Ready for deployment",
  },
  {
    title: "Driver Availability",
    value: "100%",
    icon: <FiUsers />,
    note: "Fully staffed",
  },
];

export default function ExecutiveStats() {
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white border rounded-2xl p-6"
        >
          <div className="flex justify-between">

            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {item.value}
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                {item.note}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {item.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}