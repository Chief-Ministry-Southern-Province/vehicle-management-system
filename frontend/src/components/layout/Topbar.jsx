import {
  FiBell,
  FiSearch,
} from "react-icons/fi";

import { useAuth } from "../../context/useAuth";
import nationalEmblem from "../../assets/national-emblem.png";


export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm">

      <div className="flex flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        {/* ============================= */}
        {/* Left Section */}
        {/* ============================= */}

        <div className="flex min-w-0 items-center gap-4">

          {/* Government Badge */}

          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-white bg-gradient-to-br text-white shadow-lg">

            <img
                src={nationalEmblem}
                alt="National Emblem"
                className="h-108 w-108 object-contain"
              />

          </div>

          {/* Government Title */}

          <div className="min-w-0">

            <h1 className="truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl lg:text-2xl">

              Vehicle Management System

            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-sm">

              <span className="font-medium text-blue-700">

                Chief Ministry

              </span>

              <span className="hidden sm:inline">
                •
              </span>

              <span>
                Dakshinapaya
              </span>

              <span className="hidden sm:inline">
                •
              </span>

              <span>
                Labuduwa, Galle
              </span>

            </div>

          </div>

        </div>

        {/* ============================= */}
        {/* Right Section */}
        {/* ============================= */}

        <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center">

          {/* Search */}

          <div className="relative w-full lg:w-80 xl:w-96">

            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search requests, vehicles..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-12
                pr-4
                text-sm
                text-slate-700
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-300
                focus:border-blue-600
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>

                    {/* ============================= */}
          {/* Notification + User */}
          {/* ============================= */}

          <div className="flex items-center justify-between gap-4 lg:justify-end">

            {/* Notification */}

            <button
              className="
                relative
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >

              <FiBell
                className="text-slate-700"
                size={20}
              />

              <span
                className="
                  absolute
                  right-3
                  top-3
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-red-500
                  ring-2
                  ring-white
                "
              />

            </button>

            {/* Divider */}

            <div className="hidden h-10 w-px bg-slate-200 lg:block"></div>

            {/* User Card */}

            <button
              className="
                flex
                min-w-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >

              {/* User Details */}

              <div className="hidden text-right sm:block">

                <p className="truncate text-sm font-semibold text-slate-800">

                  {user?.name || "Government User"}

                </p>

                <p className="truncate text-xs text-slate-500">

                  Employee ID :
                  {" "}
                  {user?.employee_id || "N/A"}

                </p>

              </div>

              {/* Avatar */}

              <div className="relative flex-shrink-0">

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-500
                    opacity-30
                    blur-md
                  "
                />

                <img
                  src="https://i.pravatar.cc/100"
                  alt="profile"
                  className="
                    relative
                    h-11
                    w-11
                    rounded-full
                    border-2
                    border-white
                    shadow-md
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-green-500
                  "
                />

              </div>

            </button>

          </div>

        </div>

      </div>

    </header>
  );
}