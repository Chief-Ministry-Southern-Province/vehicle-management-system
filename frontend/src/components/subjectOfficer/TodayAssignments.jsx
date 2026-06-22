export default function TodayAssignments() {
  const assignments = [
    ["VIP Convoy", "08:00 AM"],
    ["Airport Transfer", "11:30 AM"],
    ["Dept. Inspection", "02:15 PM"],
  ];

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold text-xl mb-5">
        Today's Assignments
      </h2>

      {assignments.map((item) => (
        <div
          key={item[0]}
          className="flex justify-between border-b py-4"
        >
          <span>{item[0]}</span>

          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {item[1]}
          </span>
        </div>
      ))}
    </div>
  );
}