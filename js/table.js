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

// ── Helpers para construcción segura de celdas ───────────────────────────────

/**
 * Crea una <td> con un <span> (vista) y un <input> (edición).
 * Usar textContent y .value en lugar de innerHTML evita XSC con datos del usuario.
 */
function createCell(spanText, input) {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.textContent = spanText;
  td.appendChild(span);
  td.appendChild(input);
  return td;
}

function makeInput(type, value, index, field, extra = {}) {
  const input = document.createElement("input");
  input.type = type;
  input.value = value ?? "";
  input.addEventListener("blur", (e) => onInputBlur(e, index, field));
  if (extra.min !== undefined) input.min = extra.min;
  if (extra.disabled) input.disabled = true;
  return input;
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

    // ID
    row.appendChild(
      createCell(
        rowContent.id ?? "",
        makeInput("text", rowContent.id, index, "id")
      )
    );

    // Título
    row.appendChild(
      createCell(
        rowContent.title ?? "",
        makeInput("text", rowContent.title, index, "title")
      )
    );

    // Fecha inicio (deshabilitada si tiene predecesor)
    const startInput = makeInput("date", rowContent.start_date, index, "start_date", {
      disabled: !!rowContent.predecessor,
    });
    row.appendChild(createCell(rowContent.start_date ?? "", startInput));

    // Duración
    row.appendChild(
      createCell(
        rowContent.duration ?? "1",
        makeInput("number", rowContent.duration ?? "1", index, "duration", { min: 1 })
      )
    );

    // Fecha fin (siempre deshabilitada, calculada)
    row.appendChild(
      createCell(
        rowContent.end_date ?? "",
        makeInput("date", rowContent.end_date, index, "end_date", { disabled: true })
      )
    );

    // Predecesor
    row.appendChild(
      createCell(
        rowContent.predecessor ?? "",
        makeInput("text", rowContent.predecessor, index, "predecessor")
      )
    );

    tbody.appendChild(row);
  });
}