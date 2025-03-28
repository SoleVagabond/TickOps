const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const TASKS_FILE = './tasks.json';

// Serve main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  res.json(tasks);
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const newTask = { id: Date.now(), text: req.body.text, done: false };
  tasks.push(newTask);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

// Toggle task complete
app.put('/api/tasks/:id', (req, res) => {
  let tasks = JSON.parse(fs.readFileSync(TASKS_FILE));
  const taskId = Number(req.params.id);
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`✅ TickOps running on port ${PORT}`));
