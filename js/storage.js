import { data } from "./state.js";

const STORAGE_KEY = "gantt_data";

export function saveToLocalStorage() {
  const clean = data.value.filter((d) => d.title.trim() !== "");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

export function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}