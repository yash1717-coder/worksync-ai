import { styles } from "../styles/index.js";

export default function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}
