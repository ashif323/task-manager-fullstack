import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState({ todo: 0, in_progress: 0, done: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/tasks/stats/dashboard').then(r => setStats(r.data));
    api.get('/tasks').then(r => setRecentTasks(r.data.slice(0, 5)));
  }, []);

  const statCards = [
    { label: 'To Do', value: stats.todo, color: '#6366f1' },
    { label: 'In Progress', value: stats.in_progress, color: '#f59e0b' },
    { label: 'Done', value: stats.done, color: '#10b981' },
    { label: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ];

  return (
    <div className="page">
      <h2>Welcome, {user?.name} 👋</h2>
      <div className="stats-grid">
        {statCards.map(card => (
          <div key={card.label} className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>
      <h3>Recent Tasks</h3>
      <div className="task-list">
        {recentTasks.map(task => (
          <div key={task._id} className="task-item">
            <span className={`status-badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
            <span className="task-title">{task.title}</span>
            <span className="task-project">{task.project?.name}</span>
            {task.dueDate && <span className="task-due">{new Date(task.dueDate).toLocaleDateString()}</span>}
          </div>
        ))}
        {!recentTasks.length && <p className="empty">No tasks yet.</p>}
      </div>
    </div>
  );
}