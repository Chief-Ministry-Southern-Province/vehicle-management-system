const departments = [
  { name: "Health", value: 85 },
  { name: "Education", value: 65 },
  { name: "Works", value: 45 },
  { name: "Finance", value: 30 },
  { name: "Security", value: 95 },
];

export default function DepartmentDemand() {
  return (
    <div className="bg-white border rounded-2xl p-5 h-full">

      <h3 className="text-2xl font-bold mb-6">
        Departmental Demand
      </h3>

      <div className="space-y-5">

        {departments.map((item) => (
          <div key={item.name}>

            <div className="flex justify-between text-sm mb-1">
              <span>{item.name}</span>
              <span>{item.value}%</span>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${item.value}%` }}
              />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}