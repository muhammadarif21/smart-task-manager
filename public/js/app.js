const API_URL = '/api/tasks';

// Fetch tasks
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

async function getTasks() {
  try {
    const res = await fetch('/api/tasks');
    const data = await res.json();

    console.log("DATA:", data); // debug

    renderTasks(data); // tampilkan ke UI
  } catch (error) {
    console.error("ERROR FETCH:", error);
  }
}document.addEventListener('DOMContentLoaded', getTasks);

// Create task
async function createTask(taskData) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  fetchTasks();
}

// Update task
async function updateTask(id, data) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

// Form submit
document.getElementById('taskForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const taskData = {
    title: document.getElementById('taskTitle').value.trim(),
    description: document.getElementById('taskDesc').value.trim(),
    due_date: document.getElementById('taskDue').value,
    priority: document.getElementById('taskPriority').value,
  };
  await createTask(taskData);
  this.reset();
  const modalEl = document.getElementById('taskModal');
  bootstrap.Modal.getInstance(modalEl).hide();
});

//edit form modal submit
document.getElementById('editTaskForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('editTaskId').value;

  const data = {
    title: document.getElementById('editTaskTitle').value.trim(),
    description: document.getElementById('editTaskDesc').value.trim(),
    due_date: document.getElementById('editTaskDue').value
    ? new Date(document.getElementById('editTaskDue').value).toISOString()
    : null,
    priority: document.getElementById('editTaskPriority').value,
    status: document.getElementById('editTaskStatus').value
  };

  console.log("DATA DIKIRIM KE BACKEND:", data); // Cek apakah semua field muncul di sini
  await updateTask(id, data);

  const modalEl = document.getElementById('editTaskModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
});

function openEditModal(task) {
  document.getElementById('editTaskId').value = task.$id;
  document.getElementById('editTaskTitle').value = task.title;
  document.getElementById('editTaskDesc').value = task.description;
  // 🔥 FIX DATE FORMAT DI SINI
  if (task.due_date) {
    const date = new Date(task.due_date);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    document.getElementById('editTaskDue').value = formattedDate;
  } else {
    document.getElementById('editTaskDue').value = "";
  }
  document.getElementById('editTaskPriority').value = task.priority;
  document.getElementById('editTaskStatus').value = task.status;

  const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
  modal.show();
}

// due date mendekati deadline
function getRemainingDays(due_date) {
  const today = new Date();
  const due = new Date(due_date);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  if (diff === 0) return "Due today";
  return `${diff} days left`;
}

function renderTasks(tasks) {
  // Ambil ketiga kontainer kolom Kanban
  const pendingContainer = document.getElementById("list-pending");
  const inProgressContainer = document.getElementById("list-inprogress");
  const completedContainer = document.getElementById("list-completed");

  // Kosongkan kontainer sebelum merender ulang
  if (pendingContainer) pendingContainer.innerHTML = "";
  if (inProgressContainer) inProgressContainer.innerHTML = "";
  if (completedContainer) completedContainer.innerHTML = "";

  tasks.forEach(task => {
    // Tentukan kolom tujuan berdasarkan status
    let targetContainer;
    if (task.status === "Pending") targetContainer = pendingContainer;
    else if (task.status === "In Progress") targetContainer = inProgressContainer;
    else if (task.status === "Completed") targetContainer = completedContainer;

    // Jika kolom ditemukan, masukkan kartu tugas
    if (targetContainer) {
      targetContainer.innerHTML += `
        <div class="card mb-3 shadow-sm border-start border-4 ${getPriorityColor(task.priority)}">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-1">${task.title}</h6>
            <p class="text-muted small mb-2">${task.description || "No description"}</p>

            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted" style="font-size: 0.75rem;">
                📅 ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
              </small>
              <span class="badge bg-light text-dark border" style="font-size: 0.65rem;">
                ${task.priority}
              </span>
            </div>

            <div class="mt-3 d-flex gap-1">
              <button onclick='openEditModal(${JSON.stringify(task)})' class="btn btn-outline-primary btn-sm flex-grow-1">Edit</button>
              <button onclick="deleteTask('${task.$id}')" class="btn btn-outline-danger btn-sm">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }
  });
}

// Helper function untuk warna prioritas
function getPriorityColor(priority) {
  switch (priority) {
    case 'High': return 'border-danger';
    case 'Medium': return 'border-warning';
    case 'Low': return 'border-info';
    default: return 'border-secondary';
  }
}