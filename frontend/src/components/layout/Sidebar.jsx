import {
  FiGrid,
  FiTruck,
  FiDroplet,
  FiTool,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import nationalEmblem from "../../assets/national-emblem.png";
import { BsPerson } from "react-icons/bs";
import { useLanguage } from "../../context/useLanguage";

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
        name: "Recommendation History",
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
      {
        name: "Approved Journeys",
        path: "/approvedjourny",
        icon: <FiCheckCircle />,
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
      {
        name: "Total Approvals",
        path: "/totalapprovals",
        icon: <FiCheckCircle />,
        roles: ["deputy_secretary"],
      },
      {
        name: "Approved Journeys",
        path: "/approvedjourny",
        icon: <FiCheckCircle />,
        roles: ["deputy_secretary"],
      },

      // ================= SENIOR DEPUTY SECRETARY =================

      {
        name: "Dashboard",
        path: "/seniordeputysecretarydashboard",
        icon: <FiGrid />,
        roles: ["senior_deputy_secretary"],
      },
      {
        name: "Pending Approvals",
        path: "/pendingfinalapprovals",
        icon: <FiCheckCircle />,
        roles: ["senior_deputy_secretary"],
      },
      {
        name: "Total Approvals",
        path: "/finalapprovals",
        icon: <FiCheckCircle />,
        roles: ["senior_deputy_secretary"],
      },

      // ================= SECRETARY =================

      {
        name: "Dashboard",
        path: "/secretarydashboard",
        icon: <FiGrid />,
        roles: ["secretary"],
      },
      {
        name: "Pending Approvals",
        path: "/pendingfinalapprovals",
        icon: <FiCheckCircle />,
        roles: ["secretary"],
      },
      {
        name: "Total Approvals",
        path: "/finalapprovals",
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
      {
        name: "Trip History",
        path: "/tripshistory",
        icon: <FiClock />,
        roles: ["driver"],
      },
      {
        name: "Report an Issue",
        path: "/reportvehicle",
        icon: <FiClock />,
        roles: ["driver"],
      },
    ],
  },

  // ==========================================
  // DEPARTMENT OFFICER SECTION
  // ==========================================

  {
    title: "VEHICLE REQUESTS",
    items: [
      {
        name: "Create Vehicle Request",
        path: "/createvehiclerequest",
        icon: <FiTruck />,
        roles: ["department_officer"],
      },
      {
        name: "Requests History",
        path: "/requesthistory",
        icon: <FiClipboard />,
        roles: ["department_officer"],
      },
    ],
  },



  // ==========================================
  // SUBJECT OFFICER, Deputy Secretary SECTION
  // ==========================================

  {
    title: "RECCOMMENDATIONS",
    items: [
      {
        name: "Pending Recommendations",
        path: "/deputy/pending-recommendations",
        icon: <FiClipboard />,
        roles: ["deputy_secretary"],
      },
      {
        name: "Department Recommendations",
        path: "/deputy/department-recommendations",
        icon: <FiClipboard />,
        roles: ["deputy_secretary"],
      },
    ],
  },

  {
    title: "FLLET COMPLAINTS",
    items: [
      {
        name: "Driver Issue Reports",
        path: "/ontimeavailability",
        icon: <FiAlertTriangle />,
        roles: ["subject_officer", "deputy_secretary"],
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
        name: "Driver Directory",
        path: "/driverdirectory",
        icon: <FiTruck />,
        roles: ["subject_officer"],
      },
      {
        name: "Fuel Records",
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
  // DEPUTY SECRETARY SECTION
  // ==========================================

  {
    title: "Details",
    items: [
      {
        name: "Vehicle Details",
        path: "/totalvehicles",
        icon: <FiTruck />,
        roles: ["deputy_secretary", "senior_deputy_secretary", "secretary"],
      },
      {
        name: "Driver Details",
        path: "/driverdetails",
        icon: <BsPerson />,
        roles: ["deputy_secretary", "senior_deputy_secretary", "secretary"],
      },
      {
        name: "Fuel Records",
        path: "/fuelmanagement",
        icon: <FiDroplet />,
        roles: ["deputy_secretary", "senior_deputy_secretary", "secretary"],
      },
      {
        name: "Service Records",
        path: "/servicerecords",
        icon: <FiTool />,
        roles: ["deputy_secretary", "senior_deputy_secretary", "secretary"],
      },
      {
        name: "Repair Records",
        path: "/repairrecords",
        icon: <FiTool />,
        roles: ["deputy_secretary", "senior_deputy_secretary", "secretary"],
      },
    ],
  },

  {
    title: "ADMINISTRATION PANEL",
    items: [
      {
        name: "Create Employee",
        path: "/register",
        icon: <FiBarChart2 />,
        roles: ["deputy_secretary"],
      },

      {
        name: "System Changes",
        path: "/setting",
        icon: <FiUsers />,
        roles: ["deputy_secretary"],
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
        path: "/setting",
        icon: <FiSettings />,
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Small helpers for the profile footer — purely cosmetic, no logic change
  return (
    <aside
      data-no-translate
      className="w-64 h-screen flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 relative"
    >
      {/* ---------------------------------------------------------- */}
      {/*  Header / Brand                                             */}
      {/* ---------------------------------------------------------- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
        {/* soft glow accents */}
        <div className="absolute -top-12 -right-10 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative px-8 py-6">
          <div className="flex items-center gap-3.5">
            {/* Logo badge */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl from-blue-600 to-cyan-500 shadow-lg shadow-blue-200 ring-4 ring-white">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 p-1.5 shadow-sm sm:flex">
                <img
                  src={nationalEmblem}
                  alt="National Emblem"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h1 className="text-[17px] font-bold tracking-wide text-slate-800 truncate">
                VMS
              </h1>
              <p className="text-[13px] font-medium text-slate-500 truncate">
                {t("app.fleet")}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-600">
                {t("app.country")}
              </p>
            </div>
          </div>
        </div>

        {/* bottom fade divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Menu                                                       */}
      {/* ---------------------------------------------------------- */}
      <div className="relative flex-1 overflow-y-auto py-5 px-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
        {menuItems.map((section, sIdx) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(role),
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-6 last:mb-2">
              <h3 className="px-5 mb-2.5 text-[10.5px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                {t(
                  `nav.${section.title.toLowerCase().replaceAll(" ", "_")}`,
                  section.title,
                )}
              </h3>

              <div className="space-y-1 px-3">
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={[
                        "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        isActive
                          ? "text-blue-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {/* active pill background */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 ring-1 ring-inset ring-blue-100 shadow-[0_2px_10px_-4px_rgba(37,99,235,0.25)]" />
                      )}

                      {/* active left accent bar */}
                      <span
                        className={[
                          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-600",
                          "transition-all duration-200",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-30",
                        ].join(" ")}
                      />

                      <span
                        className={[
                          "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base",
                          "transition-transform duration-200 group-hover:scale-105",
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>

                      <span className="relative truncate">
                        {t(
                          `nav.${item.name.toLowerCase().replaceAll(" ", "_")}`,
                          item.name,
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* soft section separator, skip after the last visible section */}
              {sIdx < menuItems.length - 1 && (
                <div className="mt-5 mx-5 h-px bg-slate-100" />
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Profile + Logout                                            */}
      {/* ---------------------------------------------------------- */}
      <div className="relative border-t border-slate-100 dark:border-slate-800 p-3 space-y-2 bg-slate-50/60 dark:bg-slate-950">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors">
            <FiLogOut className="text-base" />
          </span>
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
