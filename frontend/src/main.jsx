import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import RoleProvider from "./context/RoleProvider";
import { AuthProvider } from "./context/AuthProvider";
import LanguageProvider from "./context/LanguageProvider";
import { registerPushServiceWorker } from "./utils/pushNotifications";

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", savedTheme === "dark");
document.documentElement.style.colorScheme = savedTheme;

registerPushServiceWorker().catch(() => {
  // The notification panel will surface setup errors when the user enables device alerts.
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <RoleProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RoleProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
