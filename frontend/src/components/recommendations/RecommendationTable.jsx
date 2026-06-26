import {
  FiEye,
  FiMapPin,
  FiUsers,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const requests = [
  {
    id: "REQ-9012",
    name: "Dr. Sarah Chen",
    role: "Senior Researcher",
    priority: "High",
    destination: "Northern Wetlands Base",
    purpose: "Urgent environmental site visit",
    pax: 3,
    date: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "REQ-9015",
    name: "Mark Thompson",
    role: "Regional Coordinator",
    priority: "Medium",
    destination: "Central District Office",
    purpose: "Routine facility inspection",
    pax: 2,
    date: "Oct 25, 2024",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "REQ-9018",
    name: "Elena Rodriguez",
    role: "Public Liaison Officer",
    priority: "Low",
    destination: "Central Park Metro",
    purpose: "Community outreach program",
    pax: 5,
    date: "Oct 25, 2024",
    avatar: "https://i.pravatar.cc/150?img=48",
  },
  {
    id: "REQ-9012",
    name: "Dr. Sarah Chen",
    role: "Senior Researcher",
    priority: "High",
    destination: "Northern Wetlands Base",
    purpose: "Urgent environmental site visit",
    pax: 3,
    date: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "REQ-9015",
    name: "Mark Thompson",
    role: "Regional Coordinator",
    priority: "Medium",
    destination: "Central District Office",
    purpose: "Routine facility inspection",
    pax: 2,
    date: "Oct 25, 2024",
    avatar: "https://i.pravatar.cc/150?img=12",
  },{
    id: "REQ-9012",
    name: "Dr. Sarah Chen",
    role: "Senior Researcher",
    priority: "High",
    destination: "Northern Wetlands Base",
    purpose: "Urgent environmental site visit",
    pax: 3,
    date: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "REQ-9015",
    name: "Mark Thompson",
    role: "Regional Coordinator",
    priority: "Medium",
    destination: "Central District Office",
    purpose: "Routine facility inspection",
    pax: 2,
    date: "Oct 25, 2024",
    avatar: "https://i.pravatar.cc/150?img=12",
  },{
    id: "REQ-9012",
    name: "Dr. Sarah Chen",
    role: "Senior Researcher",
    priority: "High",
    destination: "Northern Wetlands Base",
    purpose: "Urgent environmental site visit",
    pax: 3,
    date: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export default function RecommendationTable() {
  const navigate = useNavigate();

  const priorityStyles = {
    High: "bg-red-50 text-red-600 border-red-200",
    Medium: "bg-amber-50 text-amber-600 border-amber-200",
    Low: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Pending Recommendations
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Vehicle requests awaiting department review
          </p>
        </div>

        <button className="text-blue-600 font-medium hover:text-blue-700">
          View All
        </button>

      </div>

      {/* Cards */}
      <div className="p-5 space-y-4">

        {requests.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate(`/employee/recommendations/${item.id}`)
            }
            className="group cursor-pointer bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">

              {/* Left */}
              <div className="flex gap-4">

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityStyles[item.priority]}`}
                    >
                      {item.priority} Priority
                    </span>

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.role}
                  </p>

                  <p className="mt-3 text-gray-700 font-medium">
                    {item.purpose}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">

                    <div className="flex items-center gap-1">
                      <FiMapPin />
                      {item.destination}
                    </div>

                    <div className="flex items-center gap-1">
                      <FiUsers />
                      {item.pax} Passengers
                    </div>

                    <div className="flex items-center gap-1">
                      <FiClock />
                      {item.date}
                    </div>

                  </div>

                </div>

              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-4">

                <span className="text-xs text-gray-400">
                  {item.id}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/employee/recommendations/${item.id}`
                    );
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                >
                  <FiEye />
                  Review
                  <FiChevronRight />
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl">

        <p className="text-sm text-gray-500">
          Showing 3 of 12 pending requests
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Previous
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            2
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}