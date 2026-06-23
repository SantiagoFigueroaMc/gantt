import { data } from "./state.js";

export function copyToClipboard() {
  const headers = Array.from(
    document.querySelectorAll("thead tr:first-child th")
  ).map((th) => th.innerText.trim());

  const rows = [headers.join("\t")];

  data.value.forEach((task) => {
    if (!task.id && !task.title) return;
    rows.push(
      [
        task.id || "",
        task.title || "",
        task.start_date || "",
        task.duration || "1",
        task.end_date || "",
        task.predecessor || "",
      ].join("\t")
    );
  });

  navigator.clipboard
    .writeText(rows.join("\n"))
    .then(() => alert("Datos copiados"))
    .catch((err) => console.error("Error al copiar al portapapeles:", err));
}