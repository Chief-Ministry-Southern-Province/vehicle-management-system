import DashboardLayout from "../../layouts/DashboardLayout";
const trips = [
  {
    id: "TR-1029",
    date: "Oct 23, 2024",
    destination: "District Office A",
    distance: "45 km",
  },
  {
    id: "TR-1025",
    date: "Oct 23, 2024",
    destination: "Central Warehouse",
    distance: "12 km",
  },
  {
    id: "TR-1022",
    date: "Oct 22, 2024",
    destination: "State Secretariat",
    distance: "8 km",
  },
  {
    id: "TR-1019",
    date: "Oct 21, 2024",
    destination: "Regional Hospital",
    distance: "32 km",
  },
];
export default function TripsHistory() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-2xl font-bold">Recent Trip History</h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm">
                <th className="p-4">Trip ID</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-t">
                  <td className="p-4 text-blue-600">{trip.id}</td>

                  <td>{trip.date}</td>

                  <td>{trip.destination}</td>

                  <td>{trip.distance}</td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
