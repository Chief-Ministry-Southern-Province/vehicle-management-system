import { FiArrowLeft, FiDownload, FiMapPin, FiPaperclip, FiUsers } from "react-icons/fi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function RecommendationReview() {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <button
                            onClick={() => navigate('/pendingrecommendations')}
                            className="flex items-center gap-2 text-gray-500 text-sm mb-2 hover:text-blue-600">
                            <FiArrowLeft />
                            View Dashboard
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                Review Request:
                                VMS-REQ-2024-882
                            </h1>

                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                Pending Recommendation
                            </span>
                        </div>
                    </div>
                    <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
                        <FiDownload />
                        Export PDF
                    </button>
                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-3 gap-4">

                    {/* Left Side */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Employee Card */}
                        {/* <div className="bg-white/10 rounded-xl shadow-sm p-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://i.pravatar.cc/100?img=5"
                                        alt="employee"
                                        className="w-16 h-16 rounded-full"
                                    />

                                    <div>
                                        <h2 className="font-bold text-lg">Mayura Pabasara</h2>
                                        <p className="text-sm text-gray-500">ID: EMP-2024-005</p>
                                    </div>

                                </div>

                                <div className="text-right">
                                    <p className="font-medium">SUBMITTED ON</p>
                                    <p className="text-sm text-gray-500">Oct 25, 2025</p>
                                    <p className="text-sm text-gray-500">2:45 PM</p>
                                </div>
                            </div>
                        </div> */}

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

                            {/* Top Accent */}
                            <div className="h-1 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500"></div>

                            <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                {/* Employee Info */}
                                <div className="flex items-center gap-4">

                                    <div className="relative">
                                        <img
                                            src="https://i.pravatar.cc/100?img=5"
                                            alt="employee"
                                            className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-50 shadow-md"
                                        />

                                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-bold text-slate-800">
                                                Mayura Pabasara
                                            </h2>

                                            <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                                Active Employee
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">
                                                Employee ID
                                            </p>

                                            <p className="font-semibold text-slate-700">
                                                EMP-2024-005
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submission Info */}
                                <div className="bg-slate-50 rounded-xl px-6 py-4 min-w-55">

                                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
                                        Request Submitted
                                    </p>

                                    <p className="text-lg font-bold text-slate-800">
                                        Oct 25, 2025
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        2:45 PM
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Journey Informaion */}
                        <div className="bg-white border rounded-xl p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                Journey Information
                            </h2>

                            <div className="space-y-5">

                                <div>
                                    <label className="font-medium flex items-center gap-2 mb-2">
                                        <FiMapPin className="text-blue-600" />
                                        Purpose of Trip
                                    </label>

                                    <div className="bg-gray-50 border rounded-lg p-4">
                                        Site inspection and community stakeholder meeting for the Green City Initiative in North District.
                                    </div>
                                </div>

                                {/* Pickup */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                PICKUP
                                            </p>
                                            <h3 className="font-semibold">
                                                HQ Block A, Main Entrance
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                OCT 25, 2025
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                2:45 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                DESTINATION
                                            </p>
                                            <h3 className="font-semibold">
                                                Green City Initiative Office
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                OCT 25, 2025
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                3:30 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Return */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                RETURN
                                            </p>
                                            <h3 className="font-semibold">
                                                HQ Block A, Main Entrance
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                OCT 25, 2025
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                5:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 border rounded-lg p-4 text-center">
                                        <p className="text-xs text-gray-500">
                                            REQUESTED VEHICLE
                                        </p>
                                        <h3 className="font-semibold text-lg">
                                            Toyota Prius 2022
                                        </h3>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500">
                                            ESTIMATED DURAYION
                                        </p>
                                        <h3 className="font-semibold text-lg">
                                            8 Hours
                                        </h3>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500">
                                            ESTIMATED DURATION
                                        </p>
                                        <h3 className="font-semibold text-lg">
                                            120 km
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Passengers */}
                            <div className="bg-white border rounded-xl p-6">

                                <h2 className="font-semibold flex items-center gap-2 mb-4">
                                    <FiUsers />
                                    Passengers
                                </h2>

                                <div className="space-y-3">
                                    <div className="border rounded-lg p-3">
                                        Sarah Jenkins
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        Mark Thorne
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        Linda Chen
                                    </div>
                                </div>

                            </div>

                            <div className="bg-white border rounded-xl p-6">

                                <h2 className="font-semibold flex items-center gap-2 mb-4">
                                    <FiPaperclip />
                                    Attachments
                                </h2>

                                <div className="space-y-3">
                                    <div className="border rounded-lg p-3">
                                        Site_Plan_North.pdf
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        Stakeholder_Meeting.docx
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">

                        {/* Recommendation Panel */}
                        <div className="bg-white border rounded-xl p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                Officer Recommendation
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium">
                                        Department Priority
                                    </label>
                                    <select className="w-full border rounded-lg p-3">
                                        <option>-- Select Priority --</option>
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium">
                                        Recommendation Notes
                                    </label>

                                    <textarea
                                        rows="6"
                                        className="w-full border rounded-lg p-3"
                                        placeholder="Add recommendation notes..."
                                    />
                                </div>

                                <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg">
                                    By recommending this request,
                                    you confirm it aligns with
                                    departmental duties.
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                                    Recommend For Allocation →
                                </button>

                                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium">
                                    Decline Request
                                </button>

                            </div>
                        </div>

                        {/* Workflow Panel */}
                        <div className="bg-white border rounded-xl p-6">

                            <h2 className="font-semibold mb-4"> Request Workflow </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium"> Submission </p>
                                    <p className="text-sm text-gray-500"> Sarah Jenkins</p>
                                </div>

                                <div className="border-l-4 border-blue-600 pl-3">
                                    <p className="font-medium text-blue-600"> Department Review </p>
                                    <p className="text-sm text-gray-500">Under Review</p>
                                </div>

                                <div>
                                    <p className="font-medium">Allocation & Approval</p>
                                    <p className="text-sm text-gray-500">Pending Subject Officer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}