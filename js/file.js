import { data, isEditable } from "./state.js";
import { saveToLocalStorage } from "./storage.js";
import { ensureRowPlaceholder } from "./table.js";

const ganttContainer = document.querySelector("div.gantt-container");
const fileDropzoneContainer = document.querySelector("div.file-dropzone");

export function toggleFileInput() {
  const hasData = data.value.filter((d) => d.title.trim() !== "").length > 0;
  ganttContainer.classList.toggle("hidden", !hasData);
  fileDropzoneContainer.classList.toggle("hidden", hasData);
}

export function onFileInput(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const parsed = JSON.parse(event.target.result);

      if (!Array.isArray(parsed)) {
        alert("El formato del JSON debe ser un arreglo de tareas.");
        return;
      }

      data.value = parsed.filter((d) => d.title && d.title.trim() !== "");

      if (isEditable()) {
        ensureRowPlaceholder();
      }

      saveToLocalStorage();
      toggleFileInput();
    } catch (error) {
      alert("Error al leer el archivo JSON. Asegúrate de que sea válido.");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

export function downloadJson() {
  const clean = data.value.filter((d) => d.title && d.title.trim() !== "");
  const jsonString = JSON.stringify(clean, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "gantt_tasks.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}