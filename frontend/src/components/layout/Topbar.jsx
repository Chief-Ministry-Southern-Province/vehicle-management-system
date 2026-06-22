import { FiBell, FiSearch } from "react-icons/fi";
import { useRole } from "../../context/useRole";

export default function Topbar() {
    const { role, setRole } = useRole();

    return (
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="font-semibold text-xl">Vehicle Management System</h1>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">Employee</span>
                
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-1 bg-slate-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                        
                    <option value="employee">Employee</option>
                    <option value="department_head">Department Head</option>
                    <option value="subject_officer">Subject Officer</option>
                    <option value="assistant_secretary">Assistant Secretary</option>
                    <option value="secretary">Secretary</option>
                </select>
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
                        <p className="font-medium">John Doe</p>
                        <p className="text-xs text-gray-500">ID: VMS-2024-001</p>
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