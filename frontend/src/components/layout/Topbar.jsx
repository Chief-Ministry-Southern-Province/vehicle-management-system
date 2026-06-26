import { FiBell, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";

export default function Topbar() {
    const { user } = useAuth();

    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="font-semibold text-xl">Vehicle Management System</h1>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                    {/* {user?.role} */}
                    {/* {role?.replace("_", " ")} */}
                </span>
    
            </div>

            <div className="flex items-center gap-5">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="Search requests, vehicles..." className="pl-10 pr-4 py-2 border rounded-lg w-80" />
                </div>

                <FiBell className="text-xl cursor-pointer" />

                <div className="h-8 w-px bg-gray-200" />

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500"> ID: {user?.employee_id} </p>
                    </div>
                </div>

                <img
                    src="https://i.pravatar.cc/40"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>

        </div>
    );
}