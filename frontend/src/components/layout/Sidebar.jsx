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
  FiX,
} from "react-icons/fi";

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { BsPerson } from "react-icons/bs";
import { useLanguage } from "../../context/useLanguage";
import { AiFillSchedule } from "react-icons/ai";

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
        name: "Pending Journeys",
        path: "/pendingjourny",
        icon: <FiClock />,
        roles: ["subject_officer"],
      },
      {
        name: "Approved Journeys",
        path: "/approvedjourny",
        icon: <FiCheckCircle />,
        roles: ["subject_officer"],
      },
      {
        name: "Daily Schedule Trips",
        path: "/dailyscheduletrips",
        icon: <AiFillSchedule />,
        roles: ["subject_officer"],
      },

      // ================= ASSISTANCE SECREATRY =================

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

      // ================= SENIOR ASSISTANCE SECRETARY =================

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

  {
    title: "VEHICLE REQUESTS",
    items: [
      {
        name: "Create Vehicle Request",
        path: "/createvehiclerequest",
        icon: <FiTruck />,
        roles: ["subject_officer"],
      },
      {
        name: "Request History",
        path: "/subjectofficer/requesthistory",
        icon: <FiClipboard />,
        roles: ["subject_officer"],
      },
    ],
  },



  // ==========================================
  // SUBJECT OFFICER, Assistance Secreatry SECTION, SENIOR ASSISTANCE SECRETARY SECTION
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
        name: "Pending Recommendation",
        path: "/senior-deputy/pending-recommendations",
        icon: <FiClipboard />,
        roles: ["senior_deputy_secretary"],
      },
    ],
  },

  {
    title: "FLLET MANAGEMENT",
    items: [
      {
        name: "Driver Issue Reports",
        path: "/ontimeavailability",
        icon: <FiAlertTriangle />,
        roles: ["subject_officer", "deputy_secretary"],
      },
      {
        name: "Approved Journeys",
        path: "/approvedjourny",
        icon: <FiCheckCircle />,
        roles: ["deputy_secretary"],
      },
      {
        name: "Daily Schedule Trips",
        path: "/dailyscheduletrips",
        icon: <AiFillSchedule />,
        roles: ["deputy_secretary"],
      },
    ],
  },

  {
    title: "VEHICLE REQUESTS",
    items: [
      {
        name: "Create Vehicle Request",
        path: "/createvehiclerequest",
        icon: <FiTruck />,
        roles: ["deputy_secretary"],
      },
      {
        name: "Request History",
        path: "/requesthistory",
        icon: <FiClipboard />,
        roles: ["deputy_secretary"],
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
  // ASSISTANCE SECREATRY SECTION
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
        path: "/systemchanges",
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

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const role = user?.role;

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Small helpers for the profile footer — purely cosmetic, no logic change
  return (
    <>
    <button
      type="button"
      aria-label="Close navigation menu"
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    />
    <aside
      id="dashboard-sidebar"
      data-no-translate
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-[min(19rem,86vw)] shrink-0 flex-col border-r border-slate-200/80 bg-linear-to-b from-white via-slate-50/90 to-blue-50/60 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 lg:relative lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-[8px_0_28px_-24px_rgba(15,23,42,0.45)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 lg:hidden dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Navigation</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || "Government User"}</p>
        </div>
        <button type="button" onClick={onClose} className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" aria-label="Close navigation menu">
          <FiX />
        </button>
      </div>
      {/* ---------------------------------------------------------- */}
      {/*  Menu                                                       */}
      {/* ---------------------------------------------------------- */}
      <div className="relative flex-1 overflow-y-auto px-1 py-6 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] dark:[scrollbar-color:#475569_transparent]">
        {menuItems.map((section, sIdx) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(role),
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-6 last:mb-2">
              <h3 className="mb-2.5 px-5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
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
                      onClick={onClose}
                      className={[
                        "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        isActive
                          ? "text-blue-800 dark:text-white"
                          : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
                      ].join(" ")}
                    >
                      {/* active pill background */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-100/90 to-teal-50 ring-1 ring-inset ring-blue-200/80 shadow-[0_8px_24px_-16px_rgba(37,99,235,0.45)] dark:from-blue-600/25 dark:to-teal-500/15 dark:ring-cyan-300/20" />
                      )}

                      {/* active left accent bar */}
                      <span
                        className={[
                          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-400",
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
                            ? "bg-linear-to-br from-blue-500 to-teal-400 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200/70 group-hover:bg-white group-hover:text-slate-700 dark:bg-white/7 dark:text-slate-400 dark:ring-transparent dark:group-hover:bg-white/10 dark:group-hover:text-slate-200",
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
                <div className="mx-5 mt-5 h-px bg-slate-200/70 dark:bg-white/7" />
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Profile + Logout                                            */}
      {/* ---------------------------------------------------------- */}
      <div className="relative space-y-2 border-t border-slate-200/80 bg-white/60 p-3 backdrop-blur-sm dark:border-white/8 dark:bg-slate-950/55">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-300 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 transition-colors group-hover:bg-rose-100 dark:bg-rose-400/10 dark:group-hover:bg-rose-400/15">
            <FiLogOut className="text-base" />
          </span>
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
    </>
  );
}
