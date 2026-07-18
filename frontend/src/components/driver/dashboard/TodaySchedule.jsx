const trips = [
  {
    id: "REQ-8830",
    time: "08:30 AM",
    title: "Trip to Dept. Sec. Office",
    pickup: "Main HQ South Wing",
    dropoff: "Regional Training Center",
    status: "Completed",
  },
  {
    id: "REQ-9902",
    time: "11:45 AM",
    title: "Trip to Technical Audit Team",
    pickup: "Regional Training Center",
    dropoff: "Ministry Finance Dept",
    status: "Ongoing",
  },
  {
    id: "REQ-9944",
    time: "02:15 PM",
    title: "Trip to Protocol Division",
    pickup: "Ministry Finance Dept",
    dropoff: "International Airport",
    status: "Pending",
  },
];

export default function TodaySchedule() {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Today's Schedule</h2>

        <div className="flex gap-2">
          <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
            Today
          </button>

          <button className="border px-3 py-1 rounded-lg">Tomorrow</button>
        </div>
      </div>

      <div className="space-y-5">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`border rounded-2xl p-5 ${
              trip.status === "Ongoing" ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400">{trip.id}</p>

                <h3 className="font-bold mt-1">{trip.time}</h3>

                <h4 className="text-lg font-semibold mt-1">{trip.title}</h4>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-slate-100">
                {trip.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs text-slate-400">PICKUP</p>

                <p>{trip.pickup}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">DROP-OFF</p>

                <p>{trip.dropoff}</p>
              </div>
            </div>

            {trip.status === "Pending" && (
              <button className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl">
                Start Trip
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
