import { useNavigate } from "react-router-dom";

const requests = [
  {
    id: "REQ-9012",
    requester: "Alice Johnson",
    category: "Official Visit",
    pax: 4,
    priority: "High",
  },
  {
    id: "REQ-9015",
    requester: "Michael Chen",
    category: "Site Inspection",
    pax: 2,
    priority: "Medium",
  },
  {
    id: "REQ-9018",
    requester: "Sarah Williams",
    category: "Inter-dept Meeting",
    pax: 1,
    priority: "Low",
  },
  {
    id: "REQ-9020",
    requester: "Robert Brown",
    category: "Field Survey",
    pax: 6,
    priority: "High",
  },
];

export default function PendingRequestsTable() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl p-5">

      <div className="flex justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold">
            Pending Requests
          </h2>

          <p className="text-sm text-gray-500">
            Latest vehicle requests awaiting your recommendation.
          </p>
        </div>

        <button 
          onClick={() => navigate('/departmentrequesthistory')}
          className="text-blue-600 text-sm">
          View All Recommendations
        </button>

      </div>

      <table className="w-full">

        <thead>
          <tr className="text-left text-gray-500 text-sm border-b">
            <th className="py-3">Req ID</th>
            <th>Requester</th>
            <th>Category</th>
            <th>Pax</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr
              key={item.id}
              className="border-b"
            >
              <td className="py-4 text-blue-600">
                {item.id}
              </td>

              <td>{item.requester}</td>

              <td>{item.category}</td>

              <td>{item.pax}</td>

              <td>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  {item.priority}
                </span>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}