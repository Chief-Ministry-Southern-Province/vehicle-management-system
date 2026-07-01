import { FiBell, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";

export default function Topbar() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">

            <div className="h-full px-8 flex items-center justify-between">

                {/* Left Side */}
                <div className="flex items-center gap-8">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Vehicle Management System
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Government Fleet Management Platform
                        </p>

                    </div>

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">

                    {/* Search */}

                    <div className="relative">

                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />

                        <input
                            type="text"
                            placeholder="Search requests, vehicles, drivers..."
                            className="
                            w-96
                            pl-14
                            pr-5
                            py-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-slate-50
                            to-slate-100
                            border
                            border-slate-200
                            text-sm
                            placeholder:text-slate-400
                            outline-none
                            transition-all
                            duration-300
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                            hover:shadow-md
                        "
                        />

                    </div>

                    {/* Notification */}

                    <button
                        className="
                        relative
                        h-12
                        w-12
                        rounded-2xl
                        bg-gradient-to-br
                        from-white
                        to-slate-100
                        border
                        border-slate-200
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        hover:shadow-lg
                        hover:-translate-y-0.5
                        transition-all
                        duration-300
                    "
                    >

                        <FiBell className="text-xl text-slate-700" />

                        <span
                            className="
                            absolute
                            top-2
                            right-2
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-red-500
                            ring-2
                            ring-white
                        "
                        />

                    </button>

                    {/* Divider */}

                    <div className="h-10 w-px bg-slate-200"></div>

                    {/* User Profile */}

                    <div
                        className="
                        flex
                        items-center
                        gap-4
                        px-4
                        py-2
                        rounded-2xl
                        bg-gradient-to-r
                        from-slate-50
                        to-white
                        border
                        border-slate-200
                        shadow-sm
                        hover:shadow-lg
                        transition-all
                        duration-300
                        cursor-pointer
                    "
                    >

                        <div className="text-right">

                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-500">
                                Employee ID : {user?.employee_id}
                            </p>

                        </div>

                        <div className="relative">

                            <div
                                className="
                                absolute
                                inset-0
                                rounded-full
                                bg-gradient-to-r
                                from-blue-500
                                to-cyan-500
                                blur-md
                                opacity-40
                            "
                            ></div>

                            <img
                                src="https://i.pravatar.cc/100"
                                alt="profile"
                                className="
                                relative
                                w-12
                                h-12
                                rounded-full
                                border-[3px]
                                border-white
                                shadow-lg
                            "
                            />

                            <span
                                className="
                                absolute
                                bottom-0
                                right-0
                                w-3.5
                                h-3.5
                                rounded-full
                                bg-green-500
                                border-2
                                border-white
                            "
                            />

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}