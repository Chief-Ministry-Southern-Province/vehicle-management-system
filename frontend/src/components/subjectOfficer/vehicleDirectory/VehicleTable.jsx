import { FiEdit2, FiTrash2, FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const getStatusStyle = (status) =>
  ({
    Available: "bg-emerald-100 text-emerald-700",
    Unavailable: "bg-rose-100 text-rose-700",
    Maintenance: "bg-amber-100 text-amber-700",
  })[status] || "bg-slate-100 text-slate-700";

const formatDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

export default function VehicleTable({ vehicles, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Registration</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Service</th>
              <th className="px-6 py-4">Fuel Level</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.reg}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-blue-600">
                    {vehicle.reg}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiTruck size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {vehicle.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Year {vehicle.year}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{vehicle.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(vehicle.status)}`}
                  >
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {formatDate(vehicle.lastServiceDate)}
                </td>
                <td className="w-56 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${vehicle.fuelLevel < 20 ? "bg-red-500" : vehicle.fuelLevel < 50 ? "bg-amber-500" : "bg-green-500"}`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {vehicle.fuelLevel}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/vehicledetails/${encodeURIComponent(vehicle.reg)}`,
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <FiEdit2 /> Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${vehicle.reg}? This cannot be undone.`,
                          )
                        )
                          onDelete(vehicle.reg);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No vehicles in the directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}
        </p>
        <span className="text-xs text-slate-400">
          Use Update to edit a vehicle.
        </span>
      </div>
    </div>
  );
}
