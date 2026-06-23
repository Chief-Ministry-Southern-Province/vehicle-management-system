const requests = [
  {
    name: "Dr. Sarah Ahmed",
    department: "Public Health",
    priority: "High",
    time: "2h ago",
    id: "REQ-9842",
  },
  {
    name: "Mr. James Wilson",
    department: "Infrastructure",
    priority: "Medium",
    time: "4h ago",
    id: "REQ-9839",
  },
  {
    name: "Hon. Elena Rodriguez",
    department: "International Relations",
    priority: "Emergency",
    time: "5h ago",
    id: "REQ-9835",
  },
  {
    name: "Maj. David Chen",
    department: "Security Affairs",
    priority: "High",
    time: "6h ago",
    id: "REQ-9831",
  },
];

export default function HighPriorityQueue() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="font-bold text-xl mb-1">
        High-Priority Queue
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Requests requiring immediate executive signature
      </p>

      <div className="space-y-4">

        {requests.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50"
          >
            <div className="flex gap-3">

              <img
                src={`https://i.pravatar.cc/100?img=${index + 10}`}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-500">
                  {item.department}
                </p>

                <span className="text-xs text-blue-600">
                  {item.id}
                </span>
              </div>

            </div>

            <button className="px-4 py-2 border rounded-lg text-sm">
              Review →
            </button>
          </div>
        ))}

      </div>

      <button className="w-full mt-5 text-blue-600 text-sm font-medium">
        View All Pending Requests
      </button>

    </div>
  );
}