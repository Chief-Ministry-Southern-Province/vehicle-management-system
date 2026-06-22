import {
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function VehicleFilters() {
  return (
    <div className="p-5 border-b">

      <div className="flex flex-wrap gap-4 items-center">

        <div className="relative flex-1 min-w-[300px]">

          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search by Registration No, Make, or Model..."
            className="w-full border rounded-xl pl-11 py-3"
          />

        </div>

        <button className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-gray-50">
          <FiFilter />
          Filters
        </button>

        <button className="text-gray-500">
          Sort By:
        </button>

      </div>

    </div>
  );
}