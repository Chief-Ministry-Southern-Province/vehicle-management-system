import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import DepartmentOfficerDashboard from './pages/dashboard/DepartmentOfficerDashboard';
import SecretaryDashboard from './pages/dashboard/SecretaryDashboard';
import SubjectOfficerDashboard from './pages/dashboard/SubjectOfficerDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import RequestHistory from './pages/requests/RequestHistory';
import EmployeeRequestDetails from './pages/requests/EmployeeRequestDetails';
import CreateVehicleRequest from './pages/requests/CreateVehicleRequest';
import RecommendationReview from './pages/recommendations/RecommendationReview';
import DepartmentRequestHistory from './pages/recommendations/DepartmentRequestHistory';
import PendingRecommendations from './pages/recommendations/PendingRecommendations';
import VehicleDirectory from './pages/fleet/VehicleDirectory';
import VehicleDetails from './pages/fleet/VehicleDetails';
import DriverDirectory from './pages/fleet/DriverDirectory';
import DriverDatabaseDetails from './pages/fleet/DriverDatabaseDetails';
import RegisterVehicle from './pages/fleet/RegisterVehicle';
import FuelManagement from './pages/fleet/FuelManagement';
import ServiceRecords from './pages/fleet/ServiceRecords';
import RepairRecords from './pages/fleet/RepairRecords';
import FleetAnalytics from './pages/fleet/FleetAnalytics';
import DeputySecretaryDashboard from './pages/dashboard/DeputySecretaryDashboard';
import SeniorDeputySecretaryDashboard from './pages/dashboard/SeniorDeputySecretaryDashboard';
import PendingApprovals from './pages/deputySecretary/PendingApprovals';
import DeputyPendingRecommendations from './pages/deputySecretary/PendingRecommendations';
import ApprovalWorkspace from './pages/deputySecretary/ApprovalWorkspace';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import TotalVehicles from './pages/deputySecretary/TotalVehicle';
import DriverDetails from './pages/deputySecretary/DriverDetails';
import DeputyVehicleDetails from './pages/deputySecretary/DeputyVehicleDetails';
import TotalApprovals from './pages/deputySecretary/TotalApprovals';
import FinalApprovals from './pages/seniorDeputySecretary/FinalApprovals';
import PendingFinalApprovals from './pages/seniorDeputySecretary/PendingFinalApprovals';
import SeniorPendingRecommendations from './pages/seniorDeputySecretary/PendingRecommendations';
import FinalApprovalDetails from './pages/seniorDeputySecretary/FinalApprovalDetails';
import ApprovedJourny from './pages/subjectOfficer/ApprovedJourny';
import SubjectOfficerRequestHistory from './pages/subjectOfficer/SubjectOfficerRequestHistory';
import TripsHistory from './pages/driver/TripsHistory';
import ReportVehicle from './pages/driver/ReportVehicle';
import OnTimeAvailability from './pages/deputySecretary/OnTimeAvailability';
import Setting from "./pages/Setting";
import SystemChanges from './pages/SystemChanges';
import PendingJourny from './pages/subjectOfficer/PendingJourny';
import DailyScheduleTrips from './pages/deputySecretary/DailyScheduleTrips';

const withAuth = (element, allowedRoles) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
);

function App() {
  
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="w-full h-screen">

          <Toaster position="top-right"/>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={withAuth(<Register />, ["deputy_secretary"])} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            <Route path="/userdashboard" element={withAuth(<UserDashboard />)} />
            <Route path="/requesthistory" element={withAuth(<RequestHistory />)} />
            <Route path="/employee/requests/:id" element={withAuth(<EmployeeRequestDetails />)} />
            

            <Route path="/departmentofficerdashboard" element={withAuth(<DepartmentOfficerDashboard />)} />
            <Route path="/createvehiclerequest" element={withAuth(<CreateVehicleRequest />, ["department_officer", "subject_officer", "deputy_secretary"])} />
            <Route path="/pendingrecommendations" element={withAuth(<PendingRecommendations />)} />
            <Route path="/employee/recommendations/:id" element={withAuth(<RecommendationReview />)} />
            <Route path="/departmentrequesthistory" element={withAuth(<DepartmentRequestHistory />)} />
            

            <Route path="/subjectofficerdashboard" element={withAuth(<SubjectOfficerDashboard />)} />
            <Route path="/subjectofficer/requesthistory" element={withAuth(<SubjectOfficerRequestHistory />, ["subject_officer"])} />
            <Route path="/subjectofficer/requests/:id" element={withAuth(<EmployeeRequestDetails historyPath="/subjectofficer/requesthistory" />, ["subject_officer"])} />
            <Route path="/vehicledirectory" element={withAuth(<VehicleDirectory />)}/>
            <Route path="/vehicledetails/:registration" element={withAuth(<VehicleDetails />)}/>
            <Route path="/driverdirectory" element={withAuth(<DriverDirectory />)}/>
            <Route path="/driverdirectory/:driverId" element={withAuth(<DriverDatabaseDetails />)}/>
            <Route path="/registervehicle" element={withAuth(<RegisterVehicle />)}/>
            <Route path="/fuelmanagement" element={withAuth(<FuelManagement />)}/>
            <Route path="/servicerecords" element={withAuth(<ServiceRecords />)}/>
            <Route path="/pendingjourny" element={withAuth(<PendingJourny />, ["subject_officer"])} />

            
            
            <Route path="/deputysecretarydashboard" element={withAuth(<DeputySecretaryDashboard />)} />
            <Route path="/seniordeputysecretarydashboard" element={withAuth(<SeniorDeputySecretaryDashboard />)} />
            <Route path="/totalapprovals" element={withAuth(<TotalApprovals />)} />
            <Route path="/pendingapprovals" element={withAuth(<PendingApprovals />)} />
            <Route path="/deputy/pending-recommendations" element={withAuth(<DeputyPendingRecommendations />, ["deputy_secretary"])} />
            <Route path="/approval/:id" element={withAuth(<ApprovalWorkspace />)} />
            <Route path="/deputy/recommendations/:id" element={withAuth(<RecommendationReview />, ["deputy_secretary"])} />
            <Route path="/senior-deputy/pending-recommendations" element={withAuth(<SeniorPendingRecommendations />, ["senior_deputy_secretary"])} />
            <Route path="/senior-deputy/recommendations/:id" element={withAuth(<RecommendationReview />, ["senior_deputy_secretary"])} />
            <Route path="/totalvehicles" element={withAuth(<TotalVehicles />)} />
            <Route path="/deputy/vehicles/:id" element={withAuth(<DeputyVehicleDetails />)} />
            <Route path="/dailyscheduletrips" element={withAuth(<DailyScheduleTrips />, ["subject_officer", "deputy_secretary"])} />



            <Route path="/finalapprovals" element={withAuth(<FinalApprovals />, ["secretary", "senior_deputy_secretary"])} />
            <Route path="/pendingfinalapprovals" element={withAuth(<PendingFinalApprovals />, ["secretary", "senior_deputy_secretary"])} />
            <Route path="/final-approvals/:id" element={withAuth(<FinalApprovalDetails />, ["secretary", "senior_deputy_secretary"])} />


            <Route path="/secretarydashboard" element={withAuth(<SecretaryDashboard />)} />

            
            <Route path="/driverdashboard" element={withAuth(<DriverDashboard />)} />
            <Route path="/tripshistory" element={withAuth(<TripsHistory />)} />
            <Route path="/reportvehicle" element={withAuth(<ReportVehicle />, ["driver"])} />


            <Route path="/setting" element={withAuth(<Setting />)} />


          </Routes>

        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
