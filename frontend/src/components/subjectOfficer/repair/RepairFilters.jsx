import {
  FiSearch,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";

export default function RepairFilters() {
  return (
    <div className="bg-white border rounded-xl p-4">

      <div className="flex items-center gap-4">

        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

          <input
            type="text"
            placeholder="Search by vehicle plate or repair type..."
            className="w-full border rounded-lg pl-10 py-3"
          />
        </div>

        <span className="text-xs font-semibold text-gray-500">
          FILTERS:
        </span>

        <button className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
          Critical
        </button>

        <button className="px-3 py-1 bg-gray-100 rounded-full text-xs">
          Active
        </button>

        <button className="flex items-center gap-2 text-sm">
          <FiFilter />
          More
          <FiChevronDown />
        </button>

      </div>
    </div>
  );
}