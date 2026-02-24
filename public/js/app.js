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
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach(task => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5>${task.title}</h5>
            <p>${task.description || ""}</p>
            <p>
              <strong>📅 ${task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "N/A"}</strong><br>
              <small class="text-muted">
                ${task.due_date ? getRemainingDays(task.due_date) : ""}
              </small>
            </p>
            <small>${task.status} | ${task.priority}</small>
            <br/>
            <button onclick='openEditModal(${JSON.stringify(task)})' class="btn btn-primary btn-sm mt-2">Edit</button>
            <button onclick="deleteTask('${task.$id}')" class="btn btn-danger btn-sm mt-2">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}

