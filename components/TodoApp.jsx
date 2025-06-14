import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const task = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setInput('');
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const toggleComplete = (id) =>
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));

  const getFiltered = () => {
    let filtered = [...tasks];
    if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    else if (filter === 'completed') filtered = filtered.filter(t => t.completed);

    if (sort === 'name') {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  return (
    <div className="todo-wrapper">
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask} disabled={!input.trim()}>Add</button>
      </div>

      <div className="options">
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">Show: All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="date">Sort: Newest</option>
          <option value="name">Sort: A-Z</option>
        </select>
      </div>

      <ul className="task-list">
        {getFiltered().map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(task.id)} title="Click to toggle status">
              {task.text}
              <small>{new Date(task.createdAt).toLocaleString()}</small>
            </span>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
        {getFiltered().length === 0 && <li className="empty">No tasks found.</li>}
      </ul>
    </div>
  );
};

export default TodoApp;
