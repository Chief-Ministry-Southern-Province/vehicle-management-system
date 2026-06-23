import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import DepartmentOfficerDashboard from './pages/dashboard/DepartmentOfficerDashboard';
import DepartmentSecretaryDashboard from './pages/dashboard/DeputySecretaryDashboard';
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

function App() {
  
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="w-full h-screen">

          <Toaster position="top-right"/>

          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/createvehiclerequest" element={<CreateVehicleRequest />} />
            <Route path="/requesthistory" element={<RequestHistory />} />
            <Route path="/employee/requests/:id" element={<EmployeeRequestDetails />} />
            

            <Route path="/departmentofficerdashboard" element={<DepartmentOfficerDashboard />} />
            <Route path="/pendingrecommendations" element={<PendingRecommendations />} />
            <Route path="/employee/recommendations/:id" element={<RecommendationReview />} />
            <Route path="/departmentrequesthistory" element={<DepartmentRequestHistory />} />
            

            <Route path="/subjectofficerdashboard" element={<SubjectOfficerDashboard />} />
            <Route path="/vehicledirectory" element={<VehicleDirectory />}/>
            <Route path="/vehicledetails" element={<VehicleDetails />}/>
            <Route path="/registervehicle" element={<RegisterVehicle />}/>
            <Route path="/fuelmanagement" element={<FuelManagement />}/>
            <Route path="/servicerecords" element={<ServiceRecords />}/>
            


            <Route path="/secretarydashboard" element={<SecretaryDashboard />} />
            

            
            <Route path="/deputysecretarydashboard" element={<DepartmentSecretaryDashboard />} />

            

          </Routes>

        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
