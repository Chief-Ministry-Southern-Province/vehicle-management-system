import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import RoleProvider from "./context/RoleProvider";
import { AuthProvider } from "./context/AuthProvider";
import LanguageProvider from "./context/LanguageProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <RoleProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RoleProvider>
    </LanguageProvider>
  </React.StrictMode>
);
