import { data } from "./state.js";

export function renderGantt() {
    const tasks = data.value.filter(t => t.title.trim() !== "");

    const timelineHeader = document.getElementById('timelineHeader');
    const timelineBody = document.getElementById('timelineBody');
    timelineHeader.innerHTML = "";
    timelineBody.innerHTML = "";
    const ganttTasksContainer = document.getElementById('ganttTasks');
    ganttTasksContainer.innerHTML = `<div class="gantt-tasks-header">Tarea</div>`;

    if (tasks.length == 0) return;

    const DAY_WIDTH = 25;

    // Evita errores de zona horaria local al parsear cadenas de texto 'YYYY-MM-DD'
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

    // Diferencia en días exacta, sin redondeos que acumulen error
    function diffDays(a, b) {
        return Math.round((a - b) / (1000 * 60 * 60 * 24));
    }

    // 1. Identificar las fechas límite inicial y final del proyecto completo
    let minDate = parseDate(tasks[0].start_date);
    let maxDate = parseDate(tasks[0].end_date);

    tasks.forEach(task => {
        const start = parseDate(task.start_date);
        const end = parseDate(task.end_date);
        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
    });

    // Colchón visual: 0 días al inicio (la etiqueta se maneja aparte) y 2 al final
    maxDate.setDate(maxDate.getDate() + 2);

    const totalDays = diffDays(maxDate, minDate);

    // 2. Renderizar el área de fechas superior y las líneas verticales punteadas
    timelineHeader.style.width = `${totalDays * DAY_WIDTH}px`;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(minDate);
        currentDate.setDate(minDate.getDate() + i);

        // Líneas guía verticales
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line';
        gridLine.style.left = `${i * DAY_WIDTH}px`;
        timelineBody.appendChild(gridLine);

        // Etiquetas de fecha cada 3 días
        if (i % 3 === 0) {
            const dateCell = document.createElement('div');
            dateCell.className = 'date-cell';
            dateCell.innerText = currentDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

            // FIX: La primera etiqueta (i=0) se ancla a la izquierda sin centrado
            // para que no quede cortada fuera del contenedor.
            // El resto usan left + translateX(-50%) para centrarse sobre su línea.
            if (i === 0) {
                dateCell.style.left = '4px';
                dateCell.style.transform = 'none';
            } else {
                dateCell.style.left = `${i * DAY_WIDTH}px`;
                // transform: translateX(-50%) viene del CSS
            }

            timelineHeader.appendChild(dateCell);
        }
    }

    // 3. Renderizar las descripciones de tareas y las barras

    tasks.forEach((task) => {
        const taskRow = document.createElement('div');
        taskRow.className = 'task-row';
        taskRow.innerText = `${task.id}. ${task.title}`;
        ganttTasksContainer.appendChild(taskRow);

        const timelineRow = document.createElement('div');
        timelineRow.className = 'timeline-row';
        timelineBody.appendChild(timelineRow);

        const taskStart = parseDate(task.start_date);
        const taskEnd = parseDate(task.end_date);

        // FIX: diffDays con Math.round en lugar de Math.ceil
        // evita que las barras aparezcan un día desplazadas a la derecha
        const daysFromStart = diffDays(taskStart, minDate);
        const taskDaysDuration = diffDays(taskEnd, taskStart);

        const leftPos = daysFromStart * DAY_WIDTH;
        const widthPos = taskDaysDuration * DAY_WIDTH;

        // Clasificación semántica de colores según palabras clave
        let colorClass = 'bar-default';
        const lowerTitle = task.title.toLowerCase();
        if (lowerTitle.includes('buscar')) colorClass = 'bar-buscar';
        else if (lowerTitle.includes('migrar')) colorClass = 'bar-migrar';
        else if (lowerTitle.includes('qa')) colorClass = 'bar-qa';
        else if (lowerTitle.includes('validación') || lowerTitle.includes('verificar')) colorClass = 'bar-validacion';

        const bar = document.createElement('div');
        bar.className = `gantt-bar ${colorClass}`;
        bar.style.left = `${leftPos}px`;
        bar.style.width = `${widthPos}px`;

        const tooltipInfo = `${task.title} | ${task.start_date} al ${task.end_date} (${task.duration} d)`;
        bar.setAttribute('data-tooltip', tooltipInfo);

        const barText = document.createElement('span');
        barText.className = 'gantt-bar-text';
        barText.innerText = `${task.duration}d`;

        bar.appendChild(barText);
        timelineRow.appendChild(bar);
    });
}