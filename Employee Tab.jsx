import { useState, useRef } from "react";
import { styles } from "../styles/index.js";

export default function EmployeesTab({ appData, updateData }) {
  const [showForm, setShowForm] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState({ name: "", empId: "", password: "", role: "", phone: "", email: "", photo: "" });
  const [error, setError] = useState("");
  const fileRef = useRef();

  function openAdd() {
    setForm({ name: "", empId: "", password: "", role: "", phone: "", email: "", photo: "" });
    setEditEmp(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(emp) {
    setForm({ ...emp });
    setEditEmp(emp.empId);
    setShowForm(true);
    setError("");
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function save() {
    if (!form.name || !form.empId || !form.password) { setError("Name, ID and Password are required."); return; }
    if (!editEmp && appData.employees.find((e) => e.empId === form.empId)) { setError("Employee ID already exists."); return; }
    updateData((prev) => ({
      employees: editEmp
        ? prev.employees.map((e) => (e.empId === editEmp ? { ...form } : e))
        : [...prev.employees, { ...form }],
    }));
    setShowForm(false);
  }

  function remove(empId) {
    if (!window.confirm("Delete this employee?")) return;
    updateData((prev) => ({ employees: prev.employees.filter((e) => e.empId !== empId) }));
  }

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.sectionTitle}>Employees ({appData.employees.length})</h2>
        <button style={styles.btnPrimary} onClick={openAdd}>+ Add Employee</button>
      </div>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>{editEmp ? "Edit Employee" : "Add Employee"}</h3>
            <div style={styles.photoWrap}>
              {form.photo
                ? <img src={form.photo} alt="photo" style={styles.empPhoto} />
                : <div style={styles.empPhotoEmpty}>📷</div>}
              <button style={styles.btnGhost} onClick={() => fileRef.current.click()}>Upload Photo</button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
            </div>
            {[
              ["Full Name", "name"],
              ["Employee ID", "empId"],
              ["Password", "password"],
              ["Role / Department", "role"],
              ["Phone", "phone"],
              ["Email", "email"],
            ].map(([lbl, key]) => (
              <div key={key}>
                <label style={styles.label}>{lbl}</label>
                <input
                  style={styles.input}
                  value={form[key]}
                  disabled={key === "empId" && !!editEmp}
                  onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setError(""); }}
                />
              </div>
            ))}
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.modalBtns}>
              <button style={styles.btnPrimary} onClick={save}>Save</button>
              <button style={styles.btnGhost} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {appData.employees.length === 0 ? (
        <p style={styles.empty}>No employees added yet. Click "+ Add Employee" to get started.</p>
      ) : (
        <div style={styles.empGrid}>
          {appData.employees.map((emp) => (
            <div key={emp.empId} style={styles.empCard}>
              {emp.photo
                ? <img src={emp.photo} alt={emp.name} style={styles.empCardPhoto} />
                : <div style={styles.empCardPhotoEmpty}>👤</div>}
              <div style={styles.empCardInfo}>
                <strong style={styles.empName}>{emp.name}</strong>
                <span style={styles.empDetail}>ID: {emp.empId}</span>
                <span style={styles.empDetail}>{emp.role || "—"}</span>
                <span style={styles.empDetail}>{emp.phone || ""}</span>
              </div>
              <div style={styles.empCardActions}>
                <button style={styles.btnSm} onClick={() => openEdit(emp)}>✏️</button>
                <button style={{ ...styles.btnSm, background: "#fee2e2", color: "#dc2626" }} onClick={() => remove(emp.empId)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
