import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ projectId: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', assignee: '' });
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const load = () => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    api.get(`/tasks?${params}`).then(r => setTasks(r.data));
  };

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data));
    api.get('/users').then(r => setUsers(r.data));
  }, []);

  useEffect(() => { load(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', assignee: '' });
    setShowForm(false);
    load();
  };

  const handleStatusChange = async (id, status) => {
    await api.patch(`/tasks/${id}/status`, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete task?')) return;
    await api.delete(`/tasks/${id}`);
    load();
  };

  const priorityColor = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tasks</h2>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        )}
      </div>
      <div className="filters">
        <select value={filters.projectId} onChange={e => setFilters({ ...filters, projectId: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {showForm && (
        <form className="card form-card" onSubmit={handleCreate}>
          <input placeholder="Task title" required value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="form-row">
            <select required value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
              <option value="">Select project *</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Assign to...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Create Task</button>
        </form>
      )}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task-card card">
            <div className="task-header">
              <div>
                <span className="priority-dot" style={{ background: priorityColor[task.priority] }} />
                <strong>{task.title}</strong>
              </div>
              <div className="task-actions">
                <select value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {user?.role === 'admin' && (
                  <button className="btn-danger-sm" onClick={() => handleDelete(task._id)}>✕</button>
                )}
              </div>
            </div>
            <p className="task-desc">{task.description}</p>
            <div className="task-meta">
              <span>📁 {task.project?.name}</span>
              {task.assignee && <span>👤 {task.assignee.name}</span>}
              {task.dueDate && (
                <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue' : ''}>
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
        {!tasks.length && <p className="empty">No tasks found.</p>}
      </div>
    </div>
  );
}