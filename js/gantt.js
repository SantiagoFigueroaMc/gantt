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

    // Ancho asignado en píxeles para representar un solo día
    const DAY_WIDTH = 25;

    // Evita errores de zona horaria local al parsear cadenas de texto 'YYYY-MM-DD'
    function parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
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

    // Otorgar un colchón visual de 2 días a los extremos
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    // Calcular la cantidad total de días del espectro del calendario
    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

    // 2. Renderizar el área de fechas superior y las líneas verticales punteadas
    timelineHeader.style.width = `${totalDays * DAY_WIDTH}px`;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(minDate);
        currentDate.setDate(minDate.getDate() + i);

        // Crear líneas guía verticales
        const gridLine = document.createElement('div');
        gridLine.className = 'grid-line';
        gridLine.style.left = `${i * DAY_WIDTH}px`;
        timelineBody.appendChild(gridLine);

        // Escribir texto de las fechas cada 3 días para evitar que se amontonen
        if (i % 3 === 0) {
            const dateCell = document.createElement('div');
            dateCell.className = 'date-cell';
            dateCell.style.left = `${i * DAY_WIDTH}px`;
            dateCell.innerText = currentDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            timelineHeader.appendChild(dateCell);
        }
    }

    // 3. Renderizar las descripciones de tareas y el bloque de barras correspondiente

    tasks.forEach((task) => {
        // Generar fila informativa en la columna izquierda
        const taskRow = document.createElement('div');
        taskRow.className = 'task-row';
        taskRow.innerText = `${task.id}. ${task.title}`;
        ganttTasksContainer.appendChild(taskRow);

        // Crear la fila paralela en el cuerpo gráfico derecho
        const timelineRow = document.createElement('div');
        timelineRow.className = 'timeline-row';
        timelineBody.appendChild(timelineRow);

        // Calcular las distancias y dimensiones basadas en píxeles
        const taskStart = parseDate(task.start_date);
        const taskEnd = parseDate(task.end_date);

        const daysFromStart = Math.ceil((taskStart - minDate) / (1000 * 60 * 60 * 24));
        const taskDaysDuration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24));

        const leftPos = daysFromStart * DAY_WIDTH;
        const widthPos = taskDaysDuration * DAY_WIDTH;

        // Clasificación semántica de colores según palabras clave
        let colorClass = 'bar-default';
        const lowerTitle = task.title.toLowerCase();
        if (lowerTitle.includes('buscar')) colorClass = 'bar-buscar';
        else if (lowerTitle.includes('migrar')) colorClass = 'bar-migrar';
        else if (lowerTitle.includes('qa')) colorClass = 'bar-qa';
        else if (lowerTitle.includes('validación') || lowerTitle.includes('verificar')) colorClass = 'bar-validacion';

        // Construcción de la barra de la Carta Gantt
        const bar = document.createElement('div');
        bar.className = `gantt-bar ${colorClass}`;
        bar.style.left = `${leftPos}px`;
        bar.style.width = `${widthPos}px`;

        // Inyección de atributos informativos para los CSS Tooltips
        const tooltipInfo = `${task.title} | ${task.start_date} al ${task.end_date} (${task.duration} d)`;
        bar.setAttribute('data-tooltip', tooltipInfo);

        // Texto de días embebido en la barra
        const barText = document.createElement('span');
        barText.className = 'gantt-bar-text';
        barText.innerText = `${task.duration}d`;

        bar.appendChild(barText);
        timelineRow.appendChild(bar);
    });

}