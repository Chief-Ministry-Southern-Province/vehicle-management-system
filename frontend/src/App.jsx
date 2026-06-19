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
            

            <Route path="/subjectofficerdashboard" element={<SubjectOfficerDashboard />} />


            <Route path="/secretarydashboard" element={<SecretaryDashboard />} />
            

            
            <Route path="/deputysecretarydashboard" element={<DepartmentSecretaryDashboard />} />

            

          </Routes>

        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
