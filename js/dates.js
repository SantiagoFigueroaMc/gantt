import { data } from "./state.js";

export function formatDate(date) {
  if (!date || isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export function addBusinessDays(dateStr, days) {
  if (!dateStr) return "";
  var date = new Date(dateStr + "T00:00:00");
  var remainingDays = parseInt(days || 0, 10);

  while (remainingDays > 0) {
    date.setDate(date.getDate() + 1);
    var dayOfWeek = date.getDay();
    // 0 = Domingo, 6 = Sábado
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remainingDays--;
    }
  }
  return formatDate(date);
}

export function generateId() {
  return Math.floor(Math.random() * 10000).toString();
}

export function getStartDate(task) {
  if (task.predecessor) {
    var pred = data.value.find((t) => t.id === task.predecessor);
    if (pred) {
      return getEndDate(pred);
    }
  }
  return task.start_date || formatDate(new Date());
}

export function getEndDate(task) {
  var start = task.start_date || getStartDate(task);
  var duration = parseInt(task.duration, 10);
  if (isNaN(duration) || duration < 1) duration = 1;
  return addBusinessDays(start, duration);
}

export function calculateTaskDates(task) {
  task.start_date = getStartDate(task);
  task.end_date = getEndDate(task);
}

export function updateSuccessorTasks(parentTask) {
  data.value.forEach((task) => {
    if (task.predecessor === parentTask.id) {
      calculateTaskDates(task);
      updateSuccessorTasks(task);
    }
  });
}