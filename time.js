export function minutesToHHMM(mins) {
  if (!mins && mins !== 0) return "--";
  const sign = mins < 0 ? "-" : "";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}h ${m}m`;
}

export function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

export function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function calcDiff(checkIn, checkOut, workStart, workEnd) {
  if (!checkIn || !checkOut) return null;
  const worked = timeToMinutes(checkOut) - timeToMinutes(checkIn);
  const required = timeToMinutes(workEnd) - timeToMinutes(workStart);
  return worked - required;
}
