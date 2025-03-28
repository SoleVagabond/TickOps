const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach(addTaskToUI);
}

function addTaskToUI(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  if (task.done) li.style.textDecoration = 'line-through';
  li.onclick = async () => {
    await fetch(`/api/tasks/${task.id}`, { method: 'PUT' });
    loadTasks();
  };
  list.appendChild(li);
}

form.onsubmit = async (e) => {
  e.preventDefault();
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';
  loadTasks();
};

loadTasks();
