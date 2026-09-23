import {
  FiEye,
  FiMapPin,
  FiUsers,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatLocalDateTime as formatDate } from "../../utils/dateTime";

const apiOrigin =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

const profilePictureUrl = (path) =>
  path ? `${apiOrigin}/${String(path).replace(/^\/+/, "")}` : null;

const initials = (name) =>
  String(name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function RecommendationTable({
  requests = [],
  loading = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Pending Recommendations
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Vehicle requests awaiting department review
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          {requests.length} pending
        </span>
      </div>

      <div className="p-5 space-y-4">
        {loading && (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading requests…
          </p>
        )}
        {!loading && requests.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            There are no pending requests for your department.
          </p>
        )}
        {requests.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/employee/recommendations/${item.id}`)}
            className="group cursor-pointer bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {initials(item.user?.name || item.requester_name)}
                  {profilePictureUrl(item.user?.profile_picture_path) && (
                    <img
                      src={profilePictureUrl(item.user.profile_picture_path)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">
                      {item.user?.name || item.requester_name}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
                      Awaiting review
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.user?.employee_id || "Employee"}
                  </p>
                  <p className="mt-3 text-gray-700 font-medium">{item.purpose}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin />
                      {item.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers />
                      {item.passenger_count} passengers
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock />
                      {formatDate(item.departure_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4 shrink-0">
                <span className="text-xs text-gray-400">VMS-REQ-{item.id}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/employee/recommendations/${item.id}`);
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
    </div>
  );
}
