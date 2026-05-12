import { styles } from "../styles/index.js";
import { todayDate, calcDiff, minutesToHHMM } from "../utils/time.js";
import StatCard from "./StatCard.jsx";

export default function OverviewTab({ appData }) {
  const today = todayDate();
  const todayRec = appData.attendance.filter((a) => a.date === today);
  const checkedIn = todayRec.filter((a) => a.checkIn && !a.checkOut).length;
  const checkedOut = todayRec.filter((a) => a.checkIn && a.checkOut).length;
  const absent = appData.employees.length - todayRec.length;
  const { workHoursStart, workHoursEnd } = appData.settings;

  const overtimeRecs = appData.attendance.filter((a) => {
    const diff = calcDiff(a.checkIn, a.checkOut, workHoursStart, workHoursEnd);
    return diff !== null && diff > 0;
  });
  const shortRecs = appData.attendance.filter((a) => {
    const diff = calcDiff(a.checkIn, a.checkOut, workHoursStart, workHoursEnd);
    return diff !== null && diff < 0;
  });

  return (
    <div>
      <h2 style={styles.sectionTitle}>Today — {today}</h2>
      <div style={styles.statsGrid}>
        <StatCard label="Total Employees" value={appData.employees.length} color="#6ee7b7" icon="👥" />
        <StatCard label="Currently In" value={checkedIn} color="#93c5fd" icon="🟢" />
        <StatCard label="Checked Out" value={checkedOut} color="#fde68a" icon="✅" />
        <StatCard label="Absent Today" value={Math.max(0, absent)} color="#fca5a5" icon="❌" />
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 28 }}>All Time Stats</h2>
      <div style={styles.statsGrid}>
        <StatCard label="Total Records" value={appData.attendance.length} color="#c4b5fd" icon="📋" />
        <StatCard label="Overtime Sessions" value={overtimeRecs.length} color="#6ee7b7" icon="⏱️" />
        <StatCard label="Short Sessions" value={shortRecs.length} color="#fca5a5" icon="⚠️" />
      </div>

      <h2 style={styles.sectionTitle}>Today's Activity</h2>
      {todayRec.length === 0 ? (
        <p style={styles.empty}>No check-ins recorded today.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>{["Employee", "Check In", "Check Out", "Status", "Diff"].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {todayRec.map((r) => {
              const emp = appData.employees.find((e) => e.empId === r.empId);
              const diff = calcDiff(r.checkIn, r.checkOut, workHoursStart, workHoursEnd);
              return (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{emp ? emp.name : r.empId}</td>
                  <td style={styles.td}>{r.checkIn || "--"}</td>
                  <td style={styles.td}>{r.checkOut || "--"}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: r.checkOut ? "#d1fae5" : "#fef3c7", color: r.checkOut ? "#065f46" : "#92400e" }}>
                      {r.checkOut ? "Done" : "In Office"}
                    </span>
                  </td>
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
  );
}
