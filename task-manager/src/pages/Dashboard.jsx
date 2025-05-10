import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

// Mock task data (replace with your actual data source)
const mockTasks = [
  { id: 1, title: 'Complete project dashboard', description: 'Finish the dashboard layout and functionality', completed: false, date: '2025-05-08', priority: 'High' },
  { id: 2, title: 'Fix CSS styling issues', description: 'Resolve conflicts between stylesheets', completed: true, date: '2025-05-07', priority: 'Medium' },
  { id: 3, title: 'Add task creation functionality', description: 'Create form for adding new tasks', completed: false, date: '2025-05-09', priority: 'High' },
  { id: 4, title: 'Implement task filtering', description: 'Add ability to filter tasks by status and priority', completed: false, date: '2025-05-10', priority: 'Medium' },
  { id: 5, title: 'Create user documentation', description: 'Write user guide for the task manager', completed: false, date: '2025-05-11', priority: 'Low' },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState(mockTasks);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const navigate = useNavigate();

  // For new task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    attachment: null
  });

  useEffect(() => {
    // Apply dashboard-specific body class
    document.body.classList.add('dashboard-layout');
    
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Clean up function to remove class when component unmounts
    return () => {
      document.body.classList.remove('dashboard-layout');
    };
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleNewTaskChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'attachment' && files) {
      setNewTask({
        ...newTask,
        attachment: files[0]
      });
    } else {
      setNewTask({
        ...newTask,
        [name]: value
      });
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    
    const newTaskWithId = {
      ...newTask,
      id: Date.now(),
      completed: false,
      date: newTask.date || new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, newTaskWithId]);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      attachment: null
    });
    
    // Navigate back to tasks view
    setActiveView('tasks');
  };

  // Task statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const totalTasks = tasks.length;

  return (
    <div className="dashboard-container">
      {/* Sidebar with navigation */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h2>Task Manager</h2>
        <ul className="sidebar-menu">
          <li 
            className={activeView === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveView('dashboard')}
          >
            <span className="icon">📊</span>
            Dashboard
          </li>
          <li 
            className={activeView === 'tasks' ? 'active' : ''}
            onClick={() => setActiveView('tasks')}
          >
            <span className="icon">📝</span>
            Tasks
          </li>
          <li 
            className={activeView === 'createTask' ? 'active' : ''}
            onClick={() => setActiveView('createTask')}
          >
            <span className="icon">➕</span>
            Create Task
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Main content area */}
      <div className="main-content">
        <header className="dashboard-header">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="toggle-sidebar-btn"
          >
            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <h1>
            {activeView === 'dashboard' && 'Dashboard'}
            {activeView === 'tasks' && 'My Tasks'}
            {activeView === 'createTask' && 'Create New Task'}
          </h1>
        </header>

        <section className="dashboard-body">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div>
              <p className="welcome-message">Welcome to your task manager dashboard!</p>
              
              <div className="dashboard-grid">
                <div className="dashboard-card stats-card">
                  <h3>Task Statistics</h3>
                  <div className="task-stats">
                    <div className="stat-item">
                      <span className="stat-value">{totalTasks}</span>
                      <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{completedTasks}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{pendingTasks}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card">
                  <h3>Recent Tasks</h3>
                  <ul className="task-list">
                    {tasks.slice(0, 3).map(task => (
                      <li key={task.id} className={task.completed ? 'completed' : ''}>
                        {task.title}
                      </li>
                    ))}
                    {tasks.length === 0 && <li className="no-tasks">No tasks yet</li>}
                  </ul>
                  <button 
                    className="view-all-btn"
                    onClick={() => setActiveView('tasks')}
                  >
                    View All Tasks
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks View */}
          {activeView === 'tasks' && (
            <div className="tasks-container">
              {tasks.length > 0 ? (
                <div className="task-list-container">
                  {tasks.map(task => (
                    <div key={task.id} className="task-item">
                      <div className="task-header">
                        <div className="task-header-left">
                          <label className="task-checkbox">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)} 
                            />
                            <span className="checkmark"></span>
                          </label>
                          <div className="task-title-section">
                            <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
                            <span className="task-date">Due: {task.date}</span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button 
                            className="task-action-btn delete-btn"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </button>
                          <button 
                            className="task-action-btn edit-btn"
                            onClick={() => {
                              // Placeholder for edit functionality
                              alert('Edit feature coming soon!');
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className={`task-action-btn expand-btn ${expandedTaskId === task.id ? 'expanded' : ''}`}
                            onClick={() => toggleTaskExpansion(task.id)}
                          >
                            ↓
                          </button>
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
                  <button 
                    className="create-first-task-btn"
                    onClick={() => setActiveView('createTask')}
                  >
                    Create your first task
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Create Task View */}
          {activeView === 'createTask' && (
            <div className="create-task-container">
              <form onSubmit={handleCreateTask} className="create-task-form">
                <div className="form-group">
                  <label>Task Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    placeholder="Enter task description"
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newTask.date}
                      onChange={handleNewTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={newTask.priority}
                      onChange={handleNewTaskChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Attachment</label>
                  <input
                    type="file"
                    name="attachment"
                    onChange={handleNewTaskChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setActiveView('tasks')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="create-btn"
                  >
                    Create Task
                  </button>
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