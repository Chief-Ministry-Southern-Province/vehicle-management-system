import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";
import RoleProvider from "./context/RoleProvider";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RoleProvider>
  </React.StrictMode>
);