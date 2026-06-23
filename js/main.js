import { data, currentFilter } from "./state.js";
import { loadFromLocalStorage } from "./storage.js";
import { renderTable, toggleEdit, onInputBlur, onFilterChange } from "./table.js";
import { renderGantt } from "./gantt.js";
import { toggleFileInput, onFileInput, downloadJson } from "./file.js";
import { copyToClipboard } from "./clipboard.js";

// ── Inicialización ───────────────────────────────────────────────────────────

const stored = loadFromLocalStorage().sort((a, b) => {
  if (!a.start_date) return 1;
  if (!b.start_date) return -1;
  return new Date(a.start_date) - new Date(b.start_date);
});
data.value = stored;

// ── Listeners reactivos ──────────────────────────────────────────────────────
// Cada vez que data cambia (set, push, splice, etc.) se re-renderizan las vistas

data.addListener(() => {
  renderTable();
  renderGantt();
  toggleFileInput();
});

currentFilter.addListener(() => {
  renderTable();
});

// ── Render inicial ───────────────────────────────────────────────────────────

renderTable();
renderGantt();
toggleFileInput();

// ── Registro del input de archivo ────────────────────────────────────────────

document.getElementById("gantt-file").addEventListener("change", onFileInput);

// ── Exposición global para los onclick del HTML ──────────────────────────────
// Los atributos onclick="..." del HTML necesitan funciones en window

window.toggleEdit = toggleEdit;
window.copyToClipboard = copyToClipboard;
window.donwloadJson = downloadJson;   // mantiene el typo original del HTML
window.onFilterChange = onFilterChange;
window.onInputBlur = onInputBlur;