import {FiGrid,FiFileText,FiTruck,FiDroplet,FiTool,FiSettings,FiUsers,FiBarChart2,FiLogOut,} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../context/useRole";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/userdashboard",
        icon: <FiGrid />,
        roles: ["employee"],
      },
      {
        name: "Vehicle Requests",
        path: "/createvehiclerequest",
        //path: "/requesthistory",
        icon: <FiFileText />,
        roles: ["employee"],
      },
      {
        name: "Request History",
        //path: "/createvehiclerequest",
        path: "/requesthistory",
        icon: <FiFileText />,
        roles: ["employee"],
      },
      {
        name: "Dashboard",
        path: "/departmentofficerdashboard",
        icon: <FiGrid />,
        roles: ["department_head"],
      },
      {
        name: "Vehicle Requests",
        path: "/pendingrecommendations",
        icon: <FiGrid />,
        roles: ["department_head"],
      },
      {
        name: "Request History",
        path: "/departmentrequesthistory",
        icon: <FiGrid />,
        roles: ["department_head"],
      },
      {
        name: "Dashboard",
        path: "/subjectofficerdashboard",
        icon: <FiGrid />,
        roles: ["subject_officer"],
      },
      {
        name: "Vehicle Requests",
        path: "/pendingrecommendations",
        icon: <FiGrid />,
        roles: ["subject_officer"],
      },
    ],
  },
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
  {
    title: "ORGANIZATION",
    items: [
      {
        name: "Drivers",
        icon: <FiUsers />,
      },
      {
        name: "Reports",
        path: "/fleetanalytics",
        icon: <FiBarChart2 />,
        roles: ["subject_officer"],
      },
      {
        name: "User Settings",
        icon: <FiSettings />,
      },
    ],
  },
];


export default function Sidebar() {
    const location = useLocation();
    const { role } = useRole();


  return (
    <aside className="w-65 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">

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

          <h1 className="text-2xl font-bold text-blue-500">
            VMS
          </h1>

        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6">

        {menuItems.map((section) => (
          <div key={section.title} className="mb-8">

            <h3 className="px-6 mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
              {section.title}
            </h3>

            <div className="space-y-1 px-3">

              {section.items
                .filter((item) => !item.roles || item.roles.includes(role))
                .map((item) => (
                // <button
                //   key={item.name}
                //   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  
                //   ${
                //     item.active
                //       ? "bg-blue-50 text-blue-600"
                //       : "text-gray-600 hover:bg-gray-100"
                //   }
                  
                //   `}
                // >
                //   <span className="text-lg">
                //     {item.icon}
                //   </span>

                //   <span>{item.name}</span>
                // </button>

                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>
                
                  <span>{item.name}</span>
                </Link>
              ))}

            </div>

          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">

        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 rounded-lg hover:bg-red-50 transition">

          <FiLogOut className="text-lg" />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}