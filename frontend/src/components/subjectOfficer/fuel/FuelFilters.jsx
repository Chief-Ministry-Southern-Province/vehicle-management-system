import {
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function FuelFilters() {
  return (
    <div className="p-5 border-b">

      <div className="flex flex-col lg:flex-row gap-4">

        <div className="relative flex-1">

          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search plate or driver..."
            className="w-full border rounded-xl pl-11 py-3"
          />

        </div>

        <button className="flex items-center gap-2 border px-4 py-3 rounded-xl hover:bg-gray-50">
          <FiFilter />
          Filters
        </button>

      </div>

    </div>
  );
}