export const STORAGE_KEY = "ems_data_v1";

export const defaultData = {
  employees: [],
  attendance: [],
  settings: { workHoursStart: "09:00", workHoursEnd: "18:00" },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultData, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultData };
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
