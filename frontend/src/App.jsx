import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import DepartmentOfficerDashboard from './pages/dashboard/DepartmentOfficerDashboard';
import SecretaryDashboard from './pages/dashboard/SecretaryDashboard';
import SubjectOfficerDashboard from './pages/dashboard/SubjectOfficerDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import CreateVehicleRequest from './pages/requests/CreateVehicleRequest';
import RequestHistory from './pages/requests/RequestHistory';
import EmployeeRequestDetails from './pages/requests/EmployeeRequestDetails';
import PendingRecommendations from './pages/recommendations/PendingRecommendations';
import RecommendationReview from './pages/recommendations/RecommendationReview';
import DepartmentRequestHistory from './pages/recommendations/DepartmentRequestHistory';
import VehicleDirectory from './pages/fleet/VehicleDirectory';
import VehicleDetails from './pages/fleet/VehicleDetails';
import RegisterVehicle from './pages/fleet/RegisterVehicle';
import FuelManagement from './pages/fleet/FuelManagement';
import ServiceRecords from './pages/fleet/ServiceRecords';
import RepairRecords from './pages/fleet/RepairRecords';
import FleetAnalytics from './pages/fleet/FleetAnalytics';
import DeputySecretaryDashboard from './pages/dashboard/DeputySecretaryDashboard';
import PendingApprovals from './pages/deputySecretary/PendingApprovals';
import ApprovalWorkspace from './pages/deputySecretary/ApprovalWorkspace';
import PendingFinalApprovals from './pages/secretary/PendingFinalApprovals';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import TotalVehicles from './pages/deputySecretary/TotalVehicle';
import DriverDetails from './pages/deputySecretary/DriverDetails';

const withAuth = (element) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

function App() {
  
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="w-full h-screen">

          <Toaster position="top-right"/>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            <Route path="/userdashboard" element={withAuth(<UserDashboard />)} />
            <Route path="/createvehiclerequest" element={withAuth(<CreateVehicleRequest />)} />
            <Route path="/requesthistory" element={withAuth(<RequestHistory />)} />
            <Route path="/employee/requests/:id" element={withAuth(<EmployeeRequestDetails />)} />
            

            <Route path="/departmentofficerdashboard" element={withAuth(<DepartmentOfficerDashboard />)} />
            <Route path="/pendingrecommendations" element={withAuth(<PendingRecommendations />)} />
            <Route path="/employee/recommendations/:id" element={withAuth(<RecommendationReview />)} />
            <Route path="/departmentrequesthistory" element={withAuth(<DepartmentRequestHistory />)} />
            

            <Route path="/subjectofficerdashboard" element={withAuth(<SubjectOfficerDashboard />)} />
            <Route path="/vehicledirectory" element={withAuth(<VehicleDirectory />)}/>
            <Route path="/vehicledetails" element={withAuth(<VehicleDetails />)}/>
            <Route path="/registervehicle" element={withAuth(<RegisterVehicle />)}/>
            <Route path="/fuelmanagement" element={withAuth(<FuelManagement />)}/>
            <Route path="/servicerecords" element={withAuth(<ServiceRecords />)}/>
            <Route path="/repairrecords" element={withAuth(<RepairRecords />)}/>
            <Route path="/fleetanalytics" element={withAuth(<FleetAnalytics />)}/>
            
            
            <Route path="/deputysecretarydashboard" element={withAuth(<DeputySecretaryDashboard />)} />
            <Route path="/pendingapprovals" element={withAuth(<PendingApprovals />)} />
            <Route path="/approval/:id" element={withAuth(<ApprovalWorkspace />)} />
            <Route path="/totalvehicles" element={withAuth(<TotalVehicles />)} />
            <Route path="/driverdetails" element={withAuth(<DriverDetails />)} />
            


            <Route path="/secretarydashboard" element={withAuth(<SecretaryDashboard />)} />
            <Route path="/pendingfinalapprovals" element={withAuth(<PendingFinalApprovals />)} />

            
            <Route path="/driverdashboard" element={withAuth(<DriverDashboard />)} />


          </Routes>

        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
