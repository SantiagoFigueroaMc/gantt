import { data, currentFilter, isEditable } from "./state.js";
import { calculateTaskDates, updateSuccessorTasks, generateId } from "./dates.js";
import { saveToLocalStorage } from "./storage.js";

const tbody = document.querySelector("tbody");

// ── Placeholder (fila borrador vacía al final) ──────────────────────────────

export function ensureRowPlaceholder() {
  const last = data.value[data.value.length - 1];
  if (!last || last.title.trim() !== "") {
    data.push({ id: generateId(), title: "", duration: "1" });
  }
}

export function removeRowPlaceholder() {
  const last = data.value[data.value.length - 1];
  if (!last || last.title === "") {
    data.value = data.value.filter((d) => d.title.trim() !== "");
  }
}

// ── Edición ─────────────────────────────────────────────────────────────────

export function toggleEdit() {
  tbody.classList.toggle("editable");
  if (isEditable()) {
    ensureRowPlaceholder();
  } else {
    removeRowPlaceholder();
  }
}

// ── Filtro ───────────────────────────────────────────────────────────────────

export function onFilterChange(e) {
  currentFilter.value = e.target.value.toLowerCase();
}

// ── Evento blur de cada celda ────────────────────────────────────────────────

export function onInputBlur(e, index, field) {
  const value = e.target.value;
  const task = data.value[index];

  if (!task || task[field] === value) return;

  task[field] = value;

  if (["predecessor", "start_date", "duration"].includes(field)) {
    calculateTaskDates(task);
    updateSuccessorTasks(task);
  }

  if (index === data.value.length - 1 && task.title !== "") {
    ensureRowPlaceholder();
  }

  // Notifica manualmente porque mutamos el objeto interno sin pasar por Observable
  data.value = [...data.value];

  saveToLocalStorage();
}

// ── Render ───────────────────────────────────────────────────────────────────

export function renderTable() {
  if (!tbody) return;
  tbody.innerHTML = "";

  let rows = data.value;

  if (!isEditable()) {
    rows = rows.filter((d) => d.title.trim() !== "");
  }

  rows.forEach((task) => calculateTaskDates(task));

  const filter = currentFilter.value;

  rows.forEach((rowContent, index) => {
    const isLast = index === rows.length - 1;
    const matchesFilter =
      !filter || rowContent.title.toLowerCase().includes(filter);

    if (!matchesFilter && !(isLast && rowContent.title === "")) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <span>${rowContent.id || ""}</span>
        <input type="text" value="${rowContent.id || ""}" onblur="onInputBlur(event, ${index}, 'id')">
      </td>
      <td>
        <span>${rowContent.title || ""}</span>
        <input type="text" value="${rowContent.title || ""}" onblur="onInputBlur(event, ${index}, 'title')">
      </td>
      <td>
        <span>${rowContent.start_date || ""}</span>
        <input type="date" value="${rowContent.start_date || ""}" onblur="onInputBlur(event, ${index}, 'start_date')" ${rowContent.predecessor ? "disabled" : ""}>
      </td>
      <td>
        <span>${rowContent.duration || "1"}</span>
        <input type="number" min="1" value="${rowContent.duration || "1"}" onblur="onInputBlur(event, ${index}, 'duration')">
      </td>
      <td>
        <span>${rowContent.end_date || ""}</span>
        <input type="date" value="${rowContent.end_date || ""}" disabled>
      </td>
      <td>
        <span>${rowContent.predecessor || ""}</span>
        <input type="text" value="${rowContent.predecessor || ""}" onblur="onInputBlur(event, ${index}, 'predecessor')">
      </td>
    `;
    tbody.appendChild(row);
  });
}