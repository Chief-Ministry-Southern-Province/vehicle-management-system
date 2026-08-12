import { lazy, Suspense, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppErrorBoundary from "./components/errors/AppErrorBoundary";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DepartmentOfficerDashboard = lazy(
  () => import("./pages/dashboard/DepartmentOfficerDashboard"),
);
const SecretaryDashboard = lazy(() => import("./pages/dashboard/SecretaryDashboard"));
const SubjectOfficerDashboard = lazy(
  () => import("./pages/dashboard/SubjectOfficerDashboard"),
);
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const DeputySecretaryDashboard = lazy(
  () => import("./pages/dashboard/DeputySecretaryDashboard"),
);
const SeniorDeputySecretaryDashboard = lazy(
  () => import("./pages/dashboard/SeniorDeputySecretaryDashboard"),
);
const DriverDashboard = lazy(() => import("./pages/dashboard/DriverDashboard"));
const RequestHistory = lazy(() => import("./pages/requests/RequestHistory"));
const EmployeeRequestDetails = lazy(() => import("./pages/requests/EmployeeRequestDetails"));
const CreateVehicleRequest = lazy(() => import("./pages/requests/CreateVehicleRequest"));
const RecommendationReview = lazy(() => import("./pages/recommendations/RecommendationReview"));
const DepartmentRequestHistory = lazy(
  () => import("./pages/recommendations/DepartmentRequestHistory"),
);
const PendingRecommendations = lazy(
  () => import("./pages/recommendations/PendingRecommendations"),
);
const VehicleDirectory = lazy(() => import("./pages/fleet/VehicleDirectory"));
const VehicleDetails = lazy(() => import("./pages/fleet/VehicleDetails"));
const DriverDirectory = lazy(() => import("./pages/fleet/DriverDirectory"));
const DriverDatabaseDetails = lazy(() => import("./pages/fleet/DriverDatabaseDetails"));
const RegisterVehicle = lazy(() => import("./pages/fleet/RegisterVehicle"));
const FuelManagement = lazy(() => import("./pages/fleet/FuelManagement"));
const ServiceRecords = lazy(() => import("./pages/fleet/ServiceRecords"));
const RepairRecords = lazy(() => import("./pages/fleet/RepairRecords"));
const FleetAnalytics = lazy(() => import("./pages/fleet/FleetAnalytics"));
const PendingApprovals = lazy(() => import("./pages/deputySecretary/PendingApprovals"));
const DeputyPendingRecommendations = lazy(
  () => import("./pages/deputySecretary/PendingRecommendations"),
);
const ApprovalWorkspace = lazy(() => import("./pages/deputySecretary/ApprovalWorkspace"));
const TotalVehicles = lazy(() => import("./pages/deputySecretary/TotalVehicle"));
const DriverDetails = lazy(() => import("./pages/deputySecretary/DriverDetails"));
const DeputyVehicleDetails = lazy(() => import("./pages/deputySecretary/DeputyVehicleDetails"));
const TotalApprovals = lazy(() => import("./pages/deputySecretary/TotalApprovals"));
const OnTimeAvailability = lazy(() => import("./pages/deputySecretary/OnTimeAvailability"));
const DailyScheduleTrips = lazy(() => import("./pages/deputySecretary/DailyScheduleTrips"));
const FinalApprovals = lazy(() => import("./pages/seniorDeputySecretary/FinalApprovals"));
const PendingFinalApprovals = lazy(
  () => import("./pages/seniorDeputySecretary/PendingFinalApprovals"),
);
const SeniorPendingRecommendations = lazy(
  () => import("./pages/seniorDeputySecretary/PendingRecommendations"),
);
const FinalApprovalDetails = lazy(
  () => import("./pages/seniorDeputySecretary/FinalApprovalDetails"),
);
const ApprovedJourny = lazy(() => import("./pages/subjectOfficer/ApprovedJourny"));
const SubjectOfficerRequestHistory = lazy(
  () => import("./pages/subjectOfficer/SubjectOfficerRequestHistory"),
);
const PendingJourny = lazy(() => import("./pages/subjectOfficer/PendingJourny"));
const TripsHistory = lazy(() => import("./pages/driver/TripsHistory"));
const ReportVehicle = lazy(() => import("./pages/driver/ReportVehicle"));
const Setting = lazy(() => import("./pages/Setting"));
const SystemChanges = lazy(() => import("./pages/SystemChanges"));

const withAuth = (element, allowedRoles) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
);

const AUTHENTICATED_ROLES = [
  "employee",
  "department_officer",
  "subject_officer",
  "deputy_secretary",
  "senior_deputy_secretary",
  "secretary",
  "driver",
];

const EXECUTIVE_FLEET_ROLES = [
  "subject_officer",
  "deputy_secretary",
  "senior_deputy_secretary",
  "secretary",
];

const RECOMMENDATION_ROLES = [
  "department_officer",
  "deputy_secretary",
  "senior_deputy_secretary",
];

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!googleClientId) {
      console.warn(
        "VITE_GOOGLE_CLIENT_ID is not configured. Google OAuth is disabled.",
      );
    }
  }, [googleClientId]);

  const appRoutes = (
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-slate-600">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={withAuth(<Register />, ["deputy_secretary"])} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/userdashboard" element={withAuth(<UserDashboard />, ["employee"])} />
          <Route path="/requesthistory" element={withAuth(<RequestHistory />, AUTHENTICATED_ROLES)} />
          <Route path="/employee/requests/:id" element={withAuth(<EmployeeRequestDetails />, AUTHENTICATED_ROLES)} />

          <Route path="/departmentofficerdashboard" element={withAuth(<DepartmentOfficerDashboard />, ["department_officer"])} />
          <Route path="/createvehiclerequest" element={withAuth(<CreateVehicleRequest />, AUTHENTICATED_ROLES)} />
          <Route path="/pendingrecommendations" element={withAuth(<PendingRecommendations />, ["department_officer"])} />
          <Route path="/employee/recommendations/:id" element={withAuth(<RecommendationReview />, RECOMMENDATION_ROLES)} />
          <Route path="/departmentrequesthistory" element={withAuth(<DepartmentRequestHistory />, ["department_officer"])} />

          <Route path="/subjectofficerdashboard" element={withAuth(<SubjectOfficerDashboard />, ["subject_officer"])} />
          <Route path="/subjectofficer/requesthistory" element={withAuth(<SubjectOfficerRequestHistory />, ["subject_officer"])} />
          <Route path="/subjectofficer/requests/:id" element={withAuth(<EmployeeRequestDetails historyPath="/subjectofficer/requesthistory" />, ["subject_officer"])} />
          <Route path="/vehicledirectory" element={withAuth(<VehicleDirectory />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/vehicledetails/:registration" element={withAuth(<VehicleDetails />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/driverdirectory" element={withAuth(<DriverDirectory />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/driverdirectory/:driverId" element={withAuth(<DriverDatabaseDetails />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/registervehicle" element={withAuth(<RegisterVehicle />, ["subject_officer"])} />
          <Route path="/fuelmanagement" element={withAuth(<FuelManagement />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/servicerecords" element={withAuth(<ServiceRecords />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/repairrecords" element={withAuth(<RepairRecords />, EXECUTIVE_FLEET_ROLES)} />
          <Route path="/fleetanalytics" element={withAuth(<FleetAnalytics />, ["subject_officer"])} />
          <Route path="/pendingjourny" element={withAuth(<PendingJourny />, ["subject_officer"])} />
          <Route path="/approvedjourny" element={withAuth(<ApprovedJourny />, ["subject_officer", "deputy_secretary"])} />

          <Route path="/deputysecretarydashboard" element={withAuth(<DeputySecretaryDashboard />, ["deputy_secretary"])} />
          <Route path="/seniordeputysecretarydashboard" element={withAuth(<SeniorDeputySecretaryDashboard />, ["senior_deputy_secretary"])} />
          <Route path="/totalapprovals" element={withAuth(<TotalApprovals />, ["deputy_secretary"])} />
          <Route path="/pendingapprovals" element={withAuth(<PendingApprovals />, ["deputy_secretary"])} />
          <Route path="/deputy/pending-recommendations" element={withAuth(<DeputyPendingRecommendations />, ["deputy_secretary"])} />
          <Route path="/approval/:id" element={withAuth(<ApprovalWorkspace />, ["deputy_secretary"])} />
          <Route path="/deputy/recommendations/:id" element={withAuth(<RecommendationReview />, ["deputy_secretary"])} />
          <Route path="/senior-deputy/pending-recommendations" element={withAuth(<SeniorPendingRecommendations />, ["senior_deputy_secretary"])} />
          <Route path="/senior-deputy/recommendations/:id" element={withAuth(<RecommendationReview />, ["senior_deputy_secretary"])} />
          <Route path="/totalvehicles" element={withAuth(<TotalVehicles />, ["deputy_secretary", "senior_deputy_secretary", "secretary"])} />
          <Route path="/deputy/vehicles/:id" element={withAuth(<DeputyVehicleDetails />, ["deputy_secretary", "senior_deputy_secretary", "secretary"])} />
          <Route path="/driverdetails" element={withAuth(<DriverDetails />, ["deputy_secretary", "senior_deputy_secretary", "secretary"])} />
          <Route path="/ontimeavailability" element={withAuth(<OnTimeAvailability />, ["subject_officer", "deputy_secretary"])} />
          <Route path="/dailyscheduletrips" element={withAuth(<DailyScheduleTrips />, ["subject_officer", "deputy_secretary"])} />

          <Route path="/finalapprovals" element={withAuth(<FinalApprovals />, ["secretary", "senior_deputy_secretary"])} />
          <Route path="/pendingfinalapprovals" element={withAuth(<PendingFinalApprovals />, ["secretary", "senior_deputy_secretary"])} />
          <Route path="/final-approvals/:id" element={withAuth(<FinalApprovalDetails />, ["secretary", "senior_deputy_secretary"])} />

          <Route path="/secretarydashboard" element={withAuth(<SecretaryDashboard />, ["secretary"])} />

          <Route path="/driverdashboard" element={withAuth(<DriverDashboard />, ["driver"])} />
          <Route path="/tripshistory" element={withAuth(<TripsHistory />, ["driver"])} />
          <Route path="/reportvehicle" element={withAuth(<ReportVehicle />, ["driver"])} />

          <Route path="/setting" element={withAuth(<Setting />, AUTHENTICATED_ROLES)} />
          <Route path="/systemchanges" element={withAuth(<SystemChanges />, ["deputy_secretary"])} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );

  return (
    <BrowserRouter>
      <div className="w-full h-screen">
        <Toaster position="top-right" />
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            {appRoutes}
          </GoogleOAuthProvider>
        ) : (
          appRoutes
        )}
        </div>
    </BrowserRouter>
  );
}

export default App;
