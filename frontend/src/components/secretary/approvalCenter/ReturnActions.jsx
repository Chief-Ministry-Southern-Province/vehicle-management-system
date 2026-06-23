import { FiRotateCcw } from "react-icons/fi";

const returns = [
  {
    id: "REQ-8991",
    department: "Social Welfare",
    time: "Returned 2h ago",
  },
  {
    id: "REQ-8985",
    department: "Education",
    time: "Returned 5h ago",
  },
];

export default function ReturnActions() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-2 mb-5">
        <FiRotateCcw />

        <h3 className="font-bold">
          Recent Return Actions
        </h3>
      </div>

      <div className="space-y-4">

        {returns.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <p className="font-medium">
                {item.id}
              </p>

              <p className="text-xs text-slate-500">
                {item.department}
              </p>
            </div>

            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
              {item.time}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}