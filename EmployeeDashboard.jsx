import { useState } from "react";
import { styles } from "../styles/index.js";
import { todayDate, nowTime, calcDiff, minutesToHHMM } from "../utils/time.js";
import StatCard from "./StatCard.jsx";

export default function EmployeeDashboard({ employee, appData, updateData, onLogout }) {
  const [msg, setMsg] = useState("");
  const today = todayDate();
  const { workHoursStart, workHoursEnd } = appData.settings;
  const todayRec = appData.attendance.find((a) => a.empId === employee.empId && a.date === today);
  const myRecords = appData.attendance
    .filter((a) => a.empId === employee.empId)
    .sort((a, b) => b.date.localeCompare(a.date));

  function checkIn() {
    if (todayRec) { setMsg("You have already checked in today."); return; }
    const id = Date.now().toString();
    updateData((prev) => ({
      attendance: [...prev.attendance, { id, empId: employee.empId, date: today, checkIn: nowTime(), checkOut: null }],
    }));
    setMsg("✅ Check-in recorded!");
  }

  function checkOut() {
    if (!todayRec || !todayRec.checkIn) { setMsg("Please check in first."); return; }
    if (todayRec.checkOut) { setMsg("You have already checked out today."); return; }
    updateData((prev) => ({
      attendance: prev.attendance.map((a) =>
        a.id === todayRec.id ? { ...a, checkOut: nowTime() } : a
      ),
    }));
    setMsg("✅ Check-out recorded!");
  }

  const totalOT = myRecords.reduce((acc, r) => {
    const d = calcDiff(r.checkIn, r.checkOut, workHoursStart, workHoursEnd);
    return d && d > 0 ? acc + d : acc;
  }, 0);

  const totalShort = myRecords.reduce((acc, r) => {
    const d = calcDiff(r.checkIn, r.checkOut, workHoursStart, workHoursEnd);
    return d && d < 0 ? acc + Math.abs(d) : acc;
  }, 0);

  return (
    <div style={styles.appWrap}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logoSmall}>⬡ WorkSync</span>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </header>

      <div style={styles.content}>
        <div style={styles.empProfile}>
          {employee.photo
            ? <img src={employee.photo} alt={employee.name} style={styles.profilePhoto} />
            : <div style={styles.profilePhotoEmpty}>👤</div>}
          <div>
            <h2 style={styles.profileName}>{employee.name}</h2>
            <p style={styles.profileRole}>{employee.role || "Employee"} · {employee.empId}</p>
            {employee.phone && <p style={styles.empDetail}>📞 {employee.phone}</p>}
            {employee.email && <p style={styles.empDetail}>✉️ {employee.email}</p>}
          </div>
        </div>

        <div style={styles.todayBox}>
          <h3 style={styles.sectionTitle}>Today — {today}</h3>
          <div style={styles.checkinRow}>
            <div style={styles.checkinInfo}>
              <span style={styles.label}>Check In:</span>
              <strong style={{ color: "#059669" }}>{todayRec?.checkIn || "--"}</strong>
            </div>
            <div style={styles.checkinInfo}>
              <span style={styles.label}>Check Out:</span>
              <strong style={{ color: "#dc2626" }}>{todayRec?.checkOut || "--"}</strong>
            </div>
          </div>
          <div style={styles.checkinBtns}>
            <button
              style={{ ...styles.btnPrimary, background: "#059669" }}
              onClick={checkIn}
              disabled={!!todayRec}
            >
              🟢 Check In
            </button>
            <button
              style={{ ...styles.btnPrimary, background: "#dc2626" }}
              onClick={checkOut}
              disabled={!todayRec || !!todayRec?.checkOut}
            >
              🔴 Check Out
            </button>
          </div>
          {msg && <p style={styles.msgBox}>{msg}</p>}
          {todayRec?.checkIn && todayRec?.checkOut && (() => {
            const diff = calcDiff(todayRec.checkIn, todayRec.checkOut, workHoursStart, workHoursEnd);
            return (
              <p style={{ marginTop: 8, fontWeight: 600, color: diff >= 0 ? "#059669" : "#dc2626" }}>
                {diff >= 0
                  ? `🕐 Overtime today: +${minutesToHHMM(diff)}`
                  : `⚠️ Short by: ${minutesToHHMM(Math.abs(diff))}`}
              </p>
            );
          })()}
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Total Days" value={myRecords.length} color="#93c5fd" icon="📅" />
          <StatCard label="Total Overtime" value={minutesToHHMM(totalOT)} color="#6ee7b7" icon="⏱️" />
          <StatCard label="Total Short Time" value={minutesToHHMM(totalShort)} color="#fca5a5" icon="⚠️" />
        </div>

        <h3 style={styles.sectionTitle}>My Attendance History</h3>
        {myRecords.length === 0 ? (
          <p style={styles.empty}>No records yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Date", "Check In", "Check Out", "Overtime / Short"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myRecords.map((r) => {
                const diff = calcDiff(r.checkIn, r.checkOut, workHoursStart, workHoursEnd);
                return (
                  <tr key={r.id} style={styles.tr}>
                    <td style={styles.td}>{r.date}</td>
                    <td style={styles.td}>{r.checkIn || "--"}</td>
                    <td style={styles.td}>{r.checkOut || "--"}</td>
                    <td style={styles.td}>
                      {diff !== null ? (
                        <span style={{ color: diff >= 0 ? "#059669" : "#dc2626", fontWeight: 600 }}>
                          {diff >= 0 ? `+${minutesToHHMM(diff)} OT` : `${minutesToHHMM(diff)}`}
                        </span>
                      ) : "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
                                      }
