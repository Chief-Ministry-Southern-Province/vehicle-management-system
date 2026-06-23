import { useNavigate } from "react-router-dom";

const approvals = [
  {
    id: "REQ-9842",
    requester: "Dr. Aris Thorne",
    dept: "Ministry of Health",
    cost: "$1,240",
    vetted: "Deputy J. Sterling",
  },
  {
    id: "REQ-9845",
    requester: "Sarah Jenkins",
    dept: "Public Works",
    cost: "$450",
    vetted: "Deputy M. Vance",
  },
  {
    id: "REQ-9849",
    requester: "Robert Chen",
    dept: "Interior",
    cost: "$3,100",
    vetted: "Deputy J. Sterling",
  },
  {
    id: "REQ-9852",
    requester: "Elena Rodriguez",
    dept: "Education",
    cost: "$820",
    vetted: "Deputy M. Vance",
  },
];

export default function FinalApprovalCenter() {
    const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">

      <div className="p-6 border-b">
        <div className="flex justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              Final Approval Center
            </h3>

            <p className="text-slate-500">
              Executive sign-off queue
            </p>
          </div>

          <button
            onClick={() => navigate('/pendingfinalapprovals')} 
            className="text-blue-600 font-medium">
            View All Queue
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-sm">
            <th className="p-4">Request ID</th>
            <th>Requester</th>
            <th>Department</th>
            <th>Cost</th>
            <th>Vetted By</th>
          </tr>
        </thead>

        <tbody>
          {approvals.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4 text-blue-600">{item.id}</td>
              <td>{item.requester}</td>
              <td>{item.dept}</td>
              <td className="font-semibold">{item.cost}</td>
              <td>{item.vetted}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}