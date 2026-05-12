import { useState } from "react";
import { styles } from "../styles/index.js";

export default function SettingsTab({ appData, updateData }) {
  const [s, setS] = useState({ ...appData.settings });
  const [saved, setSaved] = useState(false);

  function save() {
    updateData(() => ({ settings: { ...s } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>Work Hours Settings</h2>
      <div style={styles.settingsBox}>
        <label style={styles.label}>Work Start Time</label>
        <input
          type="time"
          style={styles.input}
          value={s.workHoursStart}
          onChange={(e) => setS((x) => ({ ...x, workHoursStart: e.target.value }))}
        />
        <label style={styles.label}>Work End Time</label>
        <input
          type="time"
          style={styles.input}
          value={s.workHoursEnd}
          onChange={(e) => setS((x) => ({ ...x, workHoursEnd: e.target.value }))}
        />
        <button style={styles.btnPrimary} onClick={save}>Save Settings</button>
        {saved && <p style={{ color: "#059669", marginTop: 8, fontWeight: 600 }}>✅ Saved!</p>}
        <p style={styles.note}>
          Work hours: {s.workHoursStart} – {s.workHoursEnd}. Overtime and short time calculated from these.
        </p>
      </div>
    </div>
  );
