import { useState, useEffect } from "react";
import { loadData, saveData } from "./utils/storage.js";
import LandingScreen from "./components/LandingScreen.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import EmployeeDashboard from "./components/EmployeeDashboard.jsx";

export default function App() {
  const [appData, setAppData] = useState(loadData);
  const [screen, setScreen] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    saveData(appData);
  }, [appData]);

  const updateData = (updater) =>
    setAppData((prev) => {
      const next = { ...prev, ...updater(prev) };
      return next;
    });

  function logout() {
    setCurrentUser(null);
    setScreen("landing");
  }

  if (screen === "landing")
    return (
      <LandingScreen
        onAdmin={(admin) => { setCurrentUser({ type: "admin", data: admin }); setScreen("adminDash"); }}
        onEmployee={(emp) => { setCurrentUser({ type: "employee", data: emp }); setScreen("employeeDash"); }}
        employees={appData.employees}
      />
    );

  if (screen === "adminDash")
    return (
      <AdminDashboard
        admin={currentUser.data}
        appData={appData}
        updateData={updateData}
        onLogout={logout}
      />
    );

  if (screen === "employeeDash")
    return (
      <EmployeeDashboard
        employee={currentUser.data}
        appData={appData}
        updateData={updateData}
        onLogout={logout}
      />
    );
}
