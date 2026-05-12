import { useState } from "react";
import { styles } from "../styles/index.js";
import OverviewTab from "./OverviewTab.jsx";
import EmployeesTab from "./EmployeesTab.jsx";
import AttendanceTab from "./AttendanceTab.jsx";
import FaceScanTab from "./FaceScanTab.jsx";
import SettingsTab from "./SettingsTab.jsx";

export default function AdminDashboard({ admin, appData, updateData, onLogout }) {
  const [tab, setTab] = useState("overview");
  const isAdmin2 = admin.id === "Admin02";

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "employees", label: "👥 Employees" },
    { id: "attendance", label: "📋 Attendance" },
    ...(isAdmin2 ? [{ id: "facescan", label: "📷 Face Check-In" }] : []),
    { id: "settings", label: "⚙️ Settings" },
  ];

  return (
    <div style={styles.appWrap}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logoSmall}>⬡ WorkSync</span>
          <span style={styles.adminBadge}>{admin.name}</span>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </header>
      <nav style={styles.nav}>
        {tabs.map((t) => (
          <button
            key={t.id}
            style={{ ...styles.navBtn, ...(tab === t.id ? styles.navBtnActive : {}) }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div style={styles.content}>
        {tab === "overview" && <OverviewTab appData={appData} />}
        {tab === "employees" && <EmployeesTab appData={appData} updateData={updateData} />}
        {tab === "attendance" && <AttendanceTab appData={appData} updateData={updateData} />}
        {tab === "facescan" && isAdmin2 && <FaceScanTab appData={appData} updateData={updateData} />}
        {tab === "settings" && <SettingsTab appData={appData} updateData={updateData} />}
      </div>
    </div>
  );
}
