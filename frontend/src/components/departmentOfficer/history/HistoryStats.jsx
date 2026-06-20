export default function HistoryStats() {
     const stats = [
    {
      title: "TOTAL RECORDS",
      value: "1,248",
      color: "border-blue-500",
    },
    {
      title: "APPROVED",
      value: "942",
      color: "border-green-500",
    },
    {
      title: "REJECTED",
      value: "156",
      color: "border-red-500",
    },
    {
      title: "COMPLIANCE RATE",
      value: "98.4%",
      color: "border-purple-500",
    },
  ];
    return (
        <div className="grid md:grid-cols-4 gap-5">
            {stats.map((item) => (
                <div 
                    key={item.title}
                    className={'bg-white rounded-xl border-1-4 ${item.color} p-5 shadow-sm'}>

                    <p className="text-xs text-gray-500 font-medium">
                        {item.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {item.value}
                    </h2>
                </div>
            ))}

        </div>
    );
}