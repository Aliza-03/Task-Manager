import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get all tasks (for testing purposes)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get tasks for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    console.log("Received task creation request:", req.body);
    const { user_id, title, description, due_date, priority } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Set defaults for optional fields
    const taskUserId = user_id || 1; // Default to user 1 if not provided
    const taskDescription = description || '';
    const taskDueDate = due_date || new Date().toISOString().split('T')[0];
    const taskPriority = priority || 'Medium';

    console.log("Inserting task with values:", {
      user_id: taskUserId,
      title,
      description: taskDescription,
      due_date: taskDueDate,
      priority: taskPriority
    });

    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)',
      [taskUserId, title, taskDescription, taskDueDate, taskPriority]
    );

    // Return the created task along with its ID
    const newTask = {
      id: result.insertId,
      user_id: taskUserId,
      title,
      description: taskDescription,
      due_date: taskDueDate,
      priority: taskPriority,
      status: 'pending'
    };

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Update completion status
router.put('/complete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Update the completion status
    const status = completed ? 'completed' : 'pending';
    console.log(`Updating task ${id} status to ${status}`);
    
    const [result] = await pool.execute(
      'UPDATE tasks SET status = ? WHERE id = ?', 
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update a task (full update)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await pool.execute(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE id = ?',
      [title, description, due_date, priority, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get the updated task
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;