import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";
import RoleProvider from "./context/RoleProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoleProvider>
      <App />
    </RoleProvider>
  </React.StrictMode>
);