import { useState, useRef } from "react";
import { styles } from "../styles/index.js";
import { todayDate, nowTime } from "../utils/time.js";

export default function FaceScanTab({ appData, updateData }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [cameraOn, setCameraOn] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [msg, setMsg] = useState("");
  const [selEmp, setSelEmp] = useState("");

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraOn(true);
      setMsg("");
    } catch {
      setMsg("Camera access denied or not available.");
    }
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setCameraOn(false);
    setCaptured(null);
  }

  function capture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg"));
    setMsg("Photo captured! Now select employee manually to log check-in.");
  }

  function logCheckIn() {
    if (!selEmp) { setMsg("Please select an employee."); return; }
    const today = todayDate();
    const existing = appData.attendance.find((a) => a.empId === selEmp && a.date === today);
    if (existing && existing.checkIn && !existing.checkOut) {
      updateData((prev) => ({
        attendance: prev.attendance.map((a) =>
          a.empId === selEmp && a.date === today && !a.checkOut ? { ...a, checkOut: nowTime() } : a
        ),
      }));
      setMsg("✅ Check-out recorded via Face Scan panel!");
    } else if (existing && existing.checkOut) {
      setMsg("⚠️ Already fully checked out today.");
    } else {
      const id = Date.now().toString();
      updateData((prev) => ({
        attendance: [...prev.attendance, { id, empId: selEmp, date: today, checkIn: nowTime(), checkOut: null }],
      }));
      setMsg("✅ Check-in recorded via Face Scan panel!");
    }
    setCaptured(null);
    setSelEmp("");
    stopCamera();
  }

  return (
    <div>
      <h2 style={styles.sectionTitle}>📷 Face Scan Check-In (Admin02)</h2>
      <p style={styles.note}>
        Full automatic face recognition requires a server-side model. For now, capture a photo and manually confirm the employee to log attendance.
      </p>
      <div style={styles.cameraWrap}>
        <video ref={videoRef} style={{ ...styles.video, display: cameraOn && !captured ? "block" : "none" }} autoPlay muted playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {captured && <img src={captured} alt="captured" style={styles.video} />}
        {!cameraOn && !captured && <div style={styles.cameraPlaceholder}>📷 Camera Off</div>}
      </div>
      <div style={styles.cameraControls}>
        {!cameraOn && !captured && <button style={styles.btnPrimary} onClick={startCamera}>Start Camera</button>}
        {cameraOn && !captured && <button style={styles.btnPrimary} onClick={capture}>📸 Capture</button>}
        {cameraOn && <button style={styles.btnGhost} onClick={stopCamera}>Stop</button>}
      </div>
      {captured && (
        <div style={styles.empSelect}>
          <label style={styles.label}>Select Employee</label>
          <select style={styles.input} value={selEmp} onChange={(e) => setSelEmp(e.target.value)}>
            <option value="">-- Select --</option>
            {appData.employees.map((e) => (
              <option key={e.empId} value={e.empId}>{e.name} ({e.empId})</option>
            ))}
          </select>
          <button style={styles.btnPrimary} onClick={logCheckIn}>Log Attendance</button>
          <button style={styles.btnGhost} onClick={() => { setCaptured(null); setSelEmp(""); }}>Retake</button>
        </div>
      )}
      {msg && <p style={styles.msgBox}>{msg}</p>}
    </div>
  );
      }
