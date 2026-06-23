import {
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function ServiceFilters() {
  return (
    <div className="bg-white border rounded-xl p-4">

      <div className="flex gap-4">

        <div className="relative flex-1">

          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />

          <input
            type="text"
            placeholder="Search Plate or Model..."
            className="w-full border rounded-xl pl-10 py-3"
          />

        </div>

        <button className="border px-5 rounded-xl flex items-center gap-2">
          <FiFilter />
          Filters
        </button>

      </div>

    </div>
  );
}