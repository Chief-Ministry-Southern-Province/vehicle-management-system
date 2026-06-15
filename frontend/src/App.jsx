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

function App() {
  
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="w-full h-screen">

          <Toaster position="top-right"/>

          <Routes path="/">
            <Route path="/" element={<Login />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/subjectofficerdashboard" element={<SubjectOfficerDashboard />} />
            <Route path="/departmentofficerdashboard" element={<DepartmentOfficerDashboard />} />
            <Route path="/secretarydashboard" element={<SecretaryDashboard />} />
            <Route path="/deputysecretarydashboard" element={<DepartmentSecretaryDashboard />} />
          </Routes>

        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
