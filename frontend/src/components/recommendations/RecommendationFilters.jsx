import {FiSearch,FiFilter,FiMoreHorizontal,} from "react-icons/fi";

export default function RecommendationFilters() {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex flex-col lg:flex-row gap-3">

        <div className="relative flex-1">
          <FiSearch className="absolute top-4 left-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or purpose..."
            className="w-full border rounded-lg pl-10 py-3"
          />
        </div>

        <button className="border px-4 rounded-lg flex items-center gap-2">
          <FiFilter />
          Filters
        </button>

        <button className="border px-4 rounded-lg">
          <FiMoreHorizontal />
        </button>

      </div>
    </div>
  );
}
