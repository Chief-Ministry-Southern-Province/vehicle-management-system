import {
  FiGrid,
  FiFileText,
  FiTruck,
  FiDroplet,
  FiTool,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiCheckCircle,
  FiClipboard,
} from "react-icons/fi";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  {
    title: "MAIN",
    items: [
      // ================= EMPLOYEE =================

      {
        name: "Dashboard",
        path: "/userdashboard",
        icon: <FiGrid />,
        roles: ["employee"],
      },
      {
        name: "Vehicle Requests",
        path: "/createvehiclerequest",
        icon: <FiFileText />,
        roles: ["employee"],
      },
      {
        name: "Request History",
        path: "/requesthistory",
        icon: <FiClipboard />,
        roles: ["employee"],
      },

      // ================= DEPARTMENT OFFICER =================

      {
        name: "Dashboard",
        path: "/departmentofficerdashboard",
        icon: <FiGrid />,
        roles: ["department_officer"],
      },
      {
        name: "Pending Recommendations",
        path: "/pendingrecommendations",
        icon: <FiFileText />,
        roles: ["department_officer"],
      },
      {
        name: "Request History",
        path: "/departmentrequesthistory",
        icon: <FiClipboard />,
        roles: ["department_officer"],
      },

      // ================= SUBJECT OFFICER =================

      {
        name: "Dashboard",
        path: "/subjectofficerdashboard",
        icon: <FiGrid />,
        roles: ["subject_officer"],
      },

      // ================= DEPUTY SECRETARY =================

      {
        name: "Dashboard",
        path: "/deputysecretarydashboard",
        icon: <FiGrid />,
        roles: ["deputy_secretary"],
      },
      {
        name: "Pending Approvals",
        path: "/pendingapprovals",
        icon: <FiCheckCircle />,
        roles: ["deputy_secretary"],
      },

      // ================= SECRETARY =================

      {
        name: "Dashboard",
        path: "/secretarydashboard",
        icon: <FiGrid />,
        roles: ["secretary"],
      },
      {
        name: "Final Approvals",
        path: "/pendingfinalapprovals",
        icon: <FiCheckCircle />,
        roles: ["secretary"],
      },

      // ================= DRIVER =================

      {
        name: "Dashboard",
        path: "/driverdashboard",
        icon: <FiGrid />,
        roles: ["driver"],
      },
    ],
  },

  // ==========================================
  // SUBJECT OFFICER SECTION
  // ==========================================

  {
    title: "FLEET OPERATIONS",
    items: [
      {
        name: "Vehicle Directory",
        path: "/vehicledirectory",
        icon: <FiTruck />,
        roles: ["subject_officer"],
      },
      {
        name: "Fuel Management",
        path: "/fuelmanagement",
        icon: <FiDroplet />,
        roles: ["subject_officer"],
      },
      {
        name: "Service Records",
        path: "/servicerecords",
        icon: <FiTool />,
        roles: ["subject_officer"],
      },
      {
        name: "Repair Records",
        path: "/repairrecords",
        icon: <FiTool />,
        roles: ["subject_officer"],
      },
    ],
  },

  // ==========================================
  // REPORTS
  // ==========================================

  {
    title: "ORGANIZATION",
    items: [
      {
        name: "Reports",
        path: "/fleetanalytics",
        icon: <FiBarChart2 />,
        roles: ["subject_officer"],
      },

      {
        name: "Drivers",
        path: "/drivers",
        icon: <FiUsers />,
        roles: ["subject_officer"],
      },

      {
        name: "User Settings",
        path: "/settings",
        icon: <FiSettings />,
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}

      <div className="h-16 flex items-center px-5 border-b border-gray-200">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">

            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M5 17h14M7 17V9h10v8M9 9V7h6v2" />
            </svg>

          </div>

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              VMS
            </h1>

            <p className="text-xs text-gray-400">
              Government Fleet
            </p>
          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto py-6">

        {menuItems.map((section) => {

          const visibleItems = section.items.filter(
            (item) =>
              !item.roles ||
              item.roles.includes(role)
          );

          if (visibleItems.length === 0)
            return null;

          return (
            <div
              key={section.title}
              className="mb-8"
            >
              <h3 className="px-6 mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
                {section.title}
              </h3>

              <div className="space-y-1 px-3">

                {visibleItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname ===
                      item.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">
                      {item.icon}
                    </span>

                    <span>
                      {item.name}
                    </span>
                  </Link>
                ))}

              </div>
            </div>
          );
        })}
      </div>

      {/* User Info */}

      <div className="px-4 py-3 border-t bg-slate-50">

        <h4 className="font-semibold text-sm">
          {user?.name || "User"}
        </h4>

        <p className="text-xs text-gray-500">
          {role?.replace("_", " ")}
        </p>

      </div>

      {/* Logout */}

      <div className="p-4 border-t">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 rounded-xl hover:bg-red-50 transition"
        >
          <FiLogOut className="text-lg" />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}