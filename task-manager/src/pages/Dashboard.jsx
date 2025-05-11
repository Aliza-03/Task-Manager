import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    attachment: null,
    user_id: user.id || 1, // Add user_id from localStorage or default to 1
  });

  // Add state for editing tasks
  const [editingTask, setEditingTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.body.classList.add('dashboard-layout');
    fetchTasks();
    return () => document.body.classList.remove('dashboard-layout');
  }, []);

  const fetchTasks = async () => {
    try {
      // Get user ID from localStorage
      const userId = user.id || 1;
      const res = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await axios.put(`http://localhost:5000/api/tasks/complete/${taskId}`, {
        completed: !task.completed
      });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleNewTaskChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment' && files.length > 0) {
      setNewTask(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    console.log("Task data to submit:", newTask); // Log the task data

    // Create a new object with the correct field names
    const taskData = {
      user_id: newTask.user_id,
      title: newTask.title,
      description: newTask.description,
      due_date: newTask.due_date, // Make sure this matches the backend field name
      priority: newTask.priority
    };

    console.log("Formatted task data:", taskData);

    try {
      // Use the correct port from your backend server (5000)
      await axios.post('http://localhost:5000/api/tasks', taskData);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        attachment: null,
        user_id: user.id || 1,
      });
      
      // Fetch updated tasks
      fetchTasks();
      
      // Optionally navigate to tasks view after creation
      setActiveView('tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      alert(`Failed to create task: ${err.response?.data?.error || err.message}`);
    }
  };

  // New Edit Task Functions
  const handleEditClick = (task) => {
    // Format the date to YYYY-MM-DD for the input field
    const formattedDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
    
    setEditingTask({
      ...task,
      due_date: formattedDate
    });
    setIsEditing(true);
    setActiveView('editTask');
  };

  const handleEditTaskChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: editingTask.title,
      description: editingTask.description,
      due_date: editingTask.due_date,
      priority: editingTask.priority
    };

    try {
      await axios.put(`http://localhost:5000/api/tasks/${editingTask.id}`, taskData);
      
      // Reset form and state
      setEditingTask(null);
      setIsEditing(false);
      
      // Fetch updated tasks
      fetchTasks();
      
      // Navigate back to tasks view
      setActiveView('tasks');
    } catch (err) {
      console.error('Error updating task:', err);
      alert(`Failed to update task: ${err.response?.data?.error || err.message}`);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setIsEditing(false);
    setActiveView('tasks');
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h2>Task Manager</h2>
        <ul className="sidebar-menu">
          <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => setActiveView('dashboard')}>
            <span className="icon">📊</span> Dashboard
          </li>
          <li className={activeView === 'tasks' ? 'active' : ''} onClick={() => setActiveView('tasks')}>
            <span className="icon">📝</span> Tasks
          </li>
          <li className={activeView === 'createTask' ? 'active' : ''} onClick={() => setActiveView('createTask')}>
            <span className="icon">➕</span> Create Task
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-sidebar-btn">
            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <h1>
            {activeView === 'dashboard' && 'Dashboard'}
            {activeView === 'tasks' && 'My Tasks'}
            {activeView === 'createTask' && 'Create New Task'}
            {activeView === 'editTask' && 'Edit Task'}
          </h1>
        </header>

        <section className="dashboard-body">
          {activeView === 'dashboard' && (
            <div>
              <p className="welcome-message">Welcome to your task manager dashboard!</p>
              <div className="dashboard-grid">
                <div className="dashboard-card stats-card">
                  <h3>Task Statistics</h3>
                  <div className="task-stats">
                    <div className="stat-item"><span className="stat-value">{totalTasks}</span><span className="stat-label">Total</span></div>
                    <div className="stat-item"><span className="stat-value">{completedTasks}</span><span className="stat-label">Completed</span></div>
                    <div className="stat-item"><span className="stat-value">{pendingTasks}</span><span className="stat-label">Pending</span></div>
                  </div>
                </div>
                <div className="dashboard-card">
                  <h3>Recent Tasks</h3>
                  <ul className="task-list">
                    {tasks.slice(0, 3).map(task => (
                      <li key={task.id} className={task.status === 'completed' ? 'completed' : ''}>{task.title}</li>
                    ))}
                    {tasks.length === 0 && <li className="no-tasks">No tasks yet</li>}
                  </ul>
                  <button className="view-all-btn" onClick={() => setActiveView('tasks')}>View All Tasks</button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'tasks' && (
            <div className="tasks-container">
              {tasks.length > 0 ? (
                <div className="task-list-container">
                  {tasks.map(task => (
                    <div key={task.id} className="task-item">
                      <div className="task-header">
                        <div className="task-header-left">
                          <label className="task-checkbox">
                            <input type="checkbox" checked={task.status === 'completed'} onChange={() => toggleTaskCompletion(task.id)} />
                            <span className="checkmark"></span>
                          </label>
                          <div className="task-title-section">
                            <h3 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h3>
                            <span className="task-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button className="task-action-btn delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                          <button className="task-action-btn edit-btn" onClick={() => handleEditClick(task)}>Edit</button>
                          <button className={`task-action-btn expand-btn ${expandedTaskId === task.id ? 'expanded' : ''}`} onClick={() => toggleTaskExpansion(task.id)}>↓</button>
                        </div>
                      </div>
                      {expandedTaskId === task.id && (
                        <div className="task-details">
                          <p>{task.description}</p>
                          <div className="task-metadata">
                            <span className="task-priority">Priority: {task.priority}</span>
                            {task.attachment && <span className="task-attachment">📎 Attachment</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You don't have any tasks yet.</p>
                  <button className="create-first-task-btn" onClick={() => setActiveView('createTask')}>Create your first task</button>
                </div>
              )}
            </div>
          )}

          {activeView === 'createTask' && (
            <div className="create-task-container">
              <form onSubmit={handleCreateTask} className="create-task-form">
                <div className="form-group">
                  <label>Task Title</label>
                  <input type="text" name="title" value={newTask.title} onChange={handleNewTaskChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={newTask.description} onChange={handleNewTaskChange} rows="4" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" name="due_date" value={newTask.due_date} onChange={handleNewTaskChange} />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" value={newTask.priority} onChange={handleNewTaskChange}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Attachment</label>
                  <input type="file" name="attachment" onChange={handleNewTaskChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setActiveView('tasks')}>Cancel</button>
                  <button type="submit" className="create-btn">Create Task</button>
                </div>
              </form>
            </div>
          )}

          {/* New Edit Task View */}
          {activeView === 'editTask' && editingTask && (
            <div className="edit-task-container">
              <form onSubmit={handleUpdateTask} className="edit-task-form">
                <div className="form-group">
                  <label>Task Title</label>
                  <input type="text" name="title" value={editingTask.title} onChange={handleEditTaskChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={editingTask.description || ''} onChange={handleEditTaskChange} rows="4" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" name="due_date" value={editingTask.due_date} onChange={handleEditTaskChange} />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" value={editingTask.priority} onChange={handleEditTaskChange}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  <button type="submit" className="update-btn">Update Task</button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;