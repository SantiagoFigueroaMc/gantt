// Tus datos de origen (Filtrado preventivo del id 32 que venía vacío)
const rawData = [{"id":"1","title":"Buscar tags en Adobe","start_date":"2026-06-15","duration":"3","end_date":"2026-06-18"},{"id":"2","title":"Buscar tags en GTM","predecessor":"1","duration":"3","start_date":"2026-06-18","end_date":"2026-06-23"},{"id":"3","title":"Abrir pixels por eventos y variables","duration":"3","start_date":"2026-06-23","end_date":"2026-06-26","predecessor":"2"},{"id":"4","title":"Verificar eventos y triggers necesarios","duration":"3","start_date":"2026-06-26","end_date":"2026-07-01","predecessor":"3"},{"id":"5","title":"Floodlight Migrar tag","duration":"2","start_date":"2026-07-01","end_date":"2026-07-03","predecessor":"4"},{"id":"6","title":"Floodlight QA","duration":"2","start_date":"2026-07-03","end_date":"2026-07-07","predecessor":"5"},{"id":"7","title":"Floodlight Validación","duration":"1","start_date":"2026-07-07","end_date":"2026-07-08","predecessor":"6"},{"id":"8","title":"Criteo Migrar tag","duration":"3","start_date":"2026-07-07","end_date":"2026-07-10","predecessor":"6"},{"id":"9","title":"Criteo QA","duration":"2","start_date":"2026-07-10","end_date":"2026-07-14","predecessor":"8"},{"id":"10","title":"Criteo Validación","duration":"1","start_date":"2026-07-14","end_date":"2026-07-15","predecessor":"9"},{"id":"11","title":"Facebook migrar tag","duration":"3","start_date":"2026-07-01","end_date":"2026-07-06","predecessor":"4"},{"id":"12","title":"Facebook QA","duration":"2","start_date":"2026-07-06","end_date":"2026-07-08","predecessor":"11"},{"id":"13","title":"Facebook Validación","duration":"1","start_date":"2026-07-08","end_date":"2026-07-09","predecessor":"12"},{"id":"14","title":"RTB Migrar tag","duration":"4","start_date":"2026-07-08","end_date":"2026-07-14","predecessor":"12"},{"id":"15","title":"RTB QA","duration":"2","start_date":"2026-07-14","end_date":"2026-07-16","predecessor":"14"},{"id":"16","title":"RTB Validación","duration":"1","start_date":"2026-07-16","end_date":"2026-07-17","predecessor":"15"},{"id":"17","title":"Enviou Migrar tag","duration":"3","start_date":"2026-07-16","end_date":"2026-07-21","predecessor":"15"},{"id":"18","title":"Enviou QA","duration":"2","start_date":"2026-07-21","end_date":"2026-07-23","predecessor":"17"},{"id":"19","title":"Enviou Validación","duration":"1","start_date":"2026-07-23","end_date":"2026-07-24","predecessor":"18"},{"id":"20","title":"Groovinads Migrar tag","duration":"3","start_date":"2026-07-23","end_date":"2026-07-28","predecessor":"18"},{"id":"21","title":"Groovinads QA","duration":"2","start_date":"2026-07-28","end_date":"2026-07-30","predecessor":"20"},{"id":"22","title":"Groovinads Validación","duration":"1","start_date":"2026-07-30","end_date":"2026-07-31","predecessor":"21"},{"id":"23","title":"Herolens Migrar tag","duration":"3","start_date":"2026-07-30","end_date":"2026-08-04","predecessor":"21"},{"id":"24","title":"Herolens QA","duration":"2","start_date":"2026-08-04","end_date":"2026-08-06","predecessor":"23"},{"id":"25","title":"Herolens Validación","duration":"1","start_date":"2026-08-06","end_date":"2026-08-07","predecessor":"24"},{"id":"26","title":"Pinterest Migrar tag","duration":"2","start_date":"2026-08-06","end_date":"2026-08-10","predecessor":"24"},{"id":"27","title":"Pinterest QA","duration":"2","start_date":"2026-08-10","end_date":"2026-08-12","predecessor":"26"},{"id":"28","title":"Pinterest Validación","duration":"1","start_date":"2026-08-12","end_date":"2026-08-13","predecessor":"27"},{"id":"29","title":"QA Verificar que los datos se envían bien","duration":"2","start_date":"2026-08-12","end_date":"2026-08-14","predecessor":"27"},{"id":"30","title":"QA Verificar que los datos se reciben bien por plataforma","duration":"2","start_date":"2026-08-14","end_date":"2026-08-18","predecessor":"29"},{"id":"31","title":"Verificar métricas en adobe","duration":"1","start_date":"2026-08-18","end_date":"2026-08-19","predecessor":"30"}];

const tasks = rawData.filter(t => t.title.trim() !== "");

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
const timelineHeader = document.getElementById('timelineHeader');
const timelineBody = document.getElementById('timelineBody');
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
const ganttTasksContainer = document.getElementById('ganttTasks');

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
