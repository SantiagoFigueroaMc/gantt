import { Observable } from "./observable.js";

// Fuente de verdad de las tareas
export const data = new Observable([]);

// Filtro de búsqueda actual
export const currentFilter = new Observable("");

// Estado de edición — lee del DOM para no duplicar estado
export function isEditable() {
  return document.querySelector("tbody")?.classList.contains("editable") ?? false;
}