import { FiMoreHorizontal } from "react-icons/fi";

const services = [
  {
    id: "SR-1001",
    vehicle: "GV-9021",
    model: "Toyota Prado",
    type: "Major Service",
    vendor: "AutoTech Solutions",
    cost: "$850",
    due: "2024-05-15",
    status: "Overdue",
  },
  {
    id: "SR-1002",
    vehicle: "GV-4482",
    model: "Mitsubishi Montero",
    type: "Routine Maintenance",
    vendor: "City Garage Ltd",
    cost: "$350",
    due: "2024-05-22",
    status: "Due Soon",
  },
  {
    id: "SR-1003",
    vehicle: "GV-1109",
    model: "Hyundai Ioniq 5",
    type: "Battery Health Check",
    vendor: "EV Experts",
    cost: "$150",
    due: "2024-06-05",
    status: "Scheduled",
  },
];

export default function ServiceScheduleTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">ID</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Vendor</th>
            <th>Cost</th>
            <th>Next Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {services.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">{item.id}</td>

              <td>
                <h4 className="font-medium">
                  {item.vehicle}
                </h4>
                <p className="text-xs text-gray-500">
                  {item.model}
                </p>
              </td>

              <td>{item.type}</td>

              <td>{item.vendor}</td>

              <td>{item.cost}</td>

              <td>{item.due}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "Overdue"
                      ? "bg-red-100 text-red-600"
                      : item.status === "Due Soon"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td>
                <button>
                  <FiMoreHorizontal />
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}