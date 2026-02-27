

import React from "react";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";

function App() {
  const isDashboardRoute = window.location.pathname === "/admin/dashboard";

  return (
    <div className={`App ${isDashboardRoute ? "dashboard-view" : ""}`}>
      {isDashboardRoute ? <AdminDashboard /> : <Login />}
    </div>
  );
}

export default App;
