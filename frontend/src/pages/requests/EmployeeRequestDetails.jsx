import {
  FiDownload,
  FiEdit,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";

export default function EmployeeRequestDetails() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500">
              Request #VMS-REQ-2024-089
            </p>

            <h1 className="text-3xl font-bold">
              Official Visit: Regional Data Center
            </h1>

            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Approved
            </span>
          </div>

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
              <FiDownload />
              Export PDF
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FiEdit />
              Modify Request
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT SIDE */}
          <div className="col-span-8 space-y-6">

            {/* Request Details */}
            <div className="bg-white rounded-xl border shadow-sm">

              <div className="p-5 border-b">
                <h2 className="font-semibold text-lg">
                  Request Dossier
                </h2>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">

                <div>
                  <label className="text-xs text-gray-500">
                    REQUEST ID
                  </label>

                  <p className="font-semibold">
                    #VMS-REQ-2024-089
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    SUBMISSION DATE
                  </label>

                  <p>Oct 24, 2024 - 09:30 AM</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    DEPARTMENT
                  </label>

                  <p>Infrastructure & IT Services</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    PASSENGERS
                  </label>

                  <p>3 Members</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500">
                    TRAVEL PURPOSE
                  </label>

                  <p>
                    Urgent onsite hardware maintenance
                    and security audit.
                  </p>
                </div>

              </div>

              <div className="border-t p-6 grid md:grid-cols-2 gap-6">

                <div className="flex gap-3">
                  <FiMapPin className="text-blue-600 mt-1" />

                  <div>
                    <p className="text-xs text-gray-500">
                      PICKUP LOCATION
                    </p>

                    <p className="font-medium">
                      Main Secretariat Gate 2
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FiMapPin className="text-red-600 mt-1" />

                  <div>
                    <p className="text-xs text-gray-500">
                      DESTINATION
                    </p>

                    <p className="font-medium">
                      Regional Data Center
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Assigned Resources */}

            <div className="bg-blue-50 rounded-xl border p-6">

              <h2 className="font-semibold mb-4">
                Assigned Resources
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {/* Vehicle */}

                <div className="bg-white border rounded-xl p-4">

                  <img
                    src="https://via.placeholder.com/300x150"
                    alt=""
                    className="rounded-lg mb-3"
                  />

                  <p className="font-semibold">
                    Toyota Land Cruiser
                  </p>

                  <p className="text-gray-600">
                    REG-99-A-1024
                  </p>
                </div>

                {/* Driver */}

                <div className="bg-white border rounded-xl p-4">

                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.pravatar.cc/100"
                      alt=""
                      className="w-16 h-16 rounded-full"
                    />

                    <div>
                      <h3 className="font-semibold">
                        Robert Jenkins
                      </h3>

                      <p className="text-gray-500">
                        Designated Driver
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Attachments */}

            <div className="bg-white rounded-xl border p-6">

              <h2 className="font-semibold mb-4">
                Request Attachments
              </h2>

              <div className="grid md:grid-cols-4 gap-4">

                {[
                  "Travel_Manifest.pdf",
                  "Route_Map.pdf",
                  "Gate_Pass.doc",
                  "Inventory_List.xls",
                ].map((file) => (
                  <div
                    key={file}
                    className="border rounded-lg p-4 flex items-center gap-3"
                  >
                    <FiFileText size={22} />

                    <div>
                      <p className="text-sm font-medium">
                        {file}
                      </p>
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-span-4 space-y-6">

            {/* Timeline */}

            <div className="bg-white rounded-xl border p-6">

              <h2 className="font-semibold mb-6">
                Approval Timeline
              </h2>

              <div className="space-y-6">

                {[
                  "Request Submitted",
                  "Department Recommendation",
                  "Administrative Approval",
                  "Executive Finalization",
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-600 mt-1"></div>

                    <div>
                      <p className="font-medium">
                        {step}
                      </p>

                      <p className="text-sm text-gray-500">
                        Oct 24, 2024
                      </p>
                    </div>
                  </div>
                ))}

              </div>

            </div>

            {/* Audit Log */}

            <div className="bg-white rounded-xl border p-6">

              <h2 className="font-semibold mb-4">
                Audit Activity Log
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="font-medium">
                    Vehicle Allocated
                  </p>

                  <p className="text-sm text-gray-500">
                    1 hour ago
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    Route Verified
                  </p>

                  <p className="text-sm text-gray-500">
                    3 hours ago
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    Status Changed
                  </p>

                  <p className="text-sm text-gray-500">
                    Yesterday
                  </p>
                </div>

              </div>

            </div>

            {/* Help Card */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

              <h3 className="font-semibold mb-2">
                Need Assistance?
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Contact the transport office if changes are needed.
              </p>

              <button className="w-full bg-white border rounded-lg py-2">
                Contact Support
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}