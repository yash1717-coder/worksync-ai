import { useState } from "react";
import { ADMINS } from "../constants/admins.js";
import { styles } from "../styles/index.js";

export default function LandingScreen({ onAdmin, onEmployee, employees }) {
  const [mode, setMode] = useState(null);
  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [empId, setEmpId] = useState("");
  const [empPw, setEmpPw] = useState("");
  const [error, setError] = useState("");

  function handleAdmin() {
    const admin = ADMINS.find((a) => a.id === adminId && a.password === adminPw);
    if (admin) { setError(""); onAdmin(admin); }
    else setError("Invalid Admin ID or Password");
  }

  function handleEmployee() {
    const emp = employees.find((e) => e.empId === empId && e.password === empPw);
    if (emp) { setError(""); onEmployee(emp); }
    else setError("Invalid Employee ID or Password");
  }

  return (
    <div style={styles.page}>
      <div style={styles.landingWrap}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⬡</span>
          <span style={styles.logoText}>WorkSync</span>
        </div>
        <p style={styles.tagline}>Attendance & Employee Management</p>

        {!mode && (
          <div style={styles.roleCards}>
            <button style={{ ...styles.roleCard, ...styles.adminCard }} onClick={() => { setMode("admin"); setError(""); }}>
              <span style={styles.roleIcon}>🛡️</span>
              <span style={styles.roleLabel}>Admin Login</span>
              <span style={styles.roleDesc}>Full system access</span>
            </button>
            <button style={{ ...styles.roleCard, ...styles.empCard }} onClick={() => { setMode("employee"); setError(""); }}>
              <span style={styles.roleIcon}>👤</span>
              <span style={styles.roleLabel}>Employee Login</span>
              <span style={styles.roleDesc}>Check in / out</span>
            </button>
          </div>
        )}

        {mode === "admin" && (
          <div style={styles.loginBox}>
            <h2 style={styles.loginTitle}>🛡️ Admin Access</h2>
            <input style={styles.input} placeholder="Admin ID (e.g. Admin01)" value={adminId}
              onChange={(e) => { setAdminId(e.target.value); setError(""); }} />
            <input style={styles.input} type="password" placeholder="Password" value={adminPw}
              onChange={(e) => { setAdminPw(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdmin()} />
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.btnPrimary} onClick={handleAdmin}>Login as Admin</button>
            <button style={styles.btnGhost} onClick={() => { setMode(null); setError(""); }}>← Back</button>
          </div>
        )}

        {mode === "employee" && (
          <div style={styles.loginBox}>
            <h2 style={styles.loginTitle}>👤 Employee Access</h2>
            <input style={styles.input} placeholder="Employee ID" value={empId}
              onChange={(e) => { setEmpId(e.target.value); setError(""); }} />
            <input style={styles.input} type="password" placeholder="Password" value={empPw}
              onChange={(e) => { setEmpPw(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleEmployee()} />
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.btnPrimary} onClick={handleEmployee}>Login</button>
            <button style={styles.btnGhost} onClick={() => { setMode(null); setError(""); }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
