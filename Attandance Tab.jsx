import { useState } from "react";
import { styles } from "../styles/index.js";
import { todayDate, nowTime, calcDiff, minutesToHHMM } from "../utils/time.js";

export default function AttendanceTab({ appData, updateData }) {
  const [filterDate, setFilterDate] = useState(todayDate());
  const [filterEmp, setFilterEmp] = useState("");
  const { workHoursStart, workHoursEnd } = appData.settings;

  const records = appData.attendance.filter((a) => {
    if (filterDate && a.date !== filterDate) return false;
    if (filterEmp && a.empId !== filterEmp) return false;
    return true;
  });

  function manualCheckout(recId) {
    const time = nowTime();
    updateData((prev) => ({
      attendance: prev.attendance.map((a) => a.id === recId ? { ...a, checkOut: time } : a),
    }));
  }

  function deleteRec(recId) {
    if (!window.confirm("Delete this record?")) return;
    updateData((prev) => ({ attendance: prev.attendance.filter((a) => a.id !== recId) }));
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Attendance Records</h2>
      <div style={styles.filters}>
        <input type="date" style={styles.input} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <select style={styles.input} value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)}>
          <option value="">All Employees</option>
          {appData.employees.map((e) => <option key={e.empId} value={e.empId}>{e.name}</option>)}
        </select>
        <button style={styles.btnGhost} onClick={() => { setFilterDate(""); setFilterEmp(""); }}>Clear</button>
      </div>

      {records.length === 0 ? (
        <p style={styles.empty}>No records found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {["Employee", "Date", "Check In", "Check Out", "Overtime", "Short", "Actions"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const emp = appData.employees.find((e) => e.empId === r.empId);
              const diff = calcDiff(r.checkIn, r.checkOut, workHoursStart, workHoursEnd);
              const isOT = diff !== null && diff > 0;
              const isShort = diff !== null && diff < 0;
              return (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{emp ? emp.name : r.empId}</td>
                  <td style={styles.td}>{r.date}</td>
                  <td style={styles.td}>{r.checkIn || "--"}</td>
                  <td style={styles.td}>{r.checkOut || "--"}</td>
                  <td style={styles.td}>
                    <span style={{ color: "#059669", fontWeight: 600 }}>{isOT ? `+${minutesToHHMM(diff)}` : "--"}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: "#dc2626", fontWeight: 600 }}>{isShort ? minutesToHHMM(diff) : "--"}</span>
                  </td>
                  <td style={styles.td}>
                    {!r.checkOut && (
                      <button style={styles.btnSm} onClick={() => manualCheckout(r.id)}>✅ Out</button>
                    )}
                    <button
                      style={{ ...styles.btnSm, background: "#fee2e2", color: "#dc2626", marginLeft: 4 }}
                      onClick={() => deleteRec(r.id)}
                    >🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
