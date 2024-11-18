const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "medium" },
  { id: 2, task: "Build a REST API", completed: false, priority: "medium" },
];

// GET /todos - Retrieve all to-do items (with optional filtering by completed status)
app.get('/todos', (req, res) => {
  const { completed } = req.query;
  if (completed !== undefined) {
    const filteredTodos = todos.filter(todo => String(todo.completed) === completed);
    return res.json(filteredTodos);
  }
  res.json(todos);
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const { task, priority = "medium" } = req.body;
  const newTodo = {
    id: todos.length + 1,
    task,
    completed: false,
    priority,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  todo.priority = req.body.priority || todo.priority;
  res.json(todo);
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send(); // 204: No Content
});

// PUT /todos/complete-all - Mark all to-do items as completed
app.put('/todos/complete-all', (req, res) => {
  todos = todos.map(todo => ({ ...todo, completed: true }));
  res.json(todos);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
