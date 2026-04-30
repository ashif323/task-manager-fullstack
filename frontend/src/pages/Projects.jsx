import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const load = () => {
    api.get('/projects').then(r => setProjects(r.data));
    api.get('/users').then(r => setUsers(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '' });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const handleAddMember = async (projectId, userId) => {
    await api.post(`/projects/${projectId}/members`, { userId });
    alert('Member added!');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Projects</h2>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>
      {showForm && (
        <form className="card form-card" onSubmit={handleCreate}>
          <input placeholder="Project name" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="btn-primary">Create Project</button>
        </form>
      )}
      <div className="projects-grid">
        {projects.map(p => (
          <div key={p._id} className="card project-card">
            <h3>{p.name}</h3>
            <p>{p.description || 'No description'}</p>
            <small>Owner: {p.owner?.name}</small>
            {user?.role === 'admin' && (
              <div className="card-actions">
                <select onChange={e => e.target.value && handleAddMember(p._id, e.target.value)} defaultValue="">
                  <option value="">Add member...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
                <button className="btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {!projects.length && <p className="empty">No projects yet.</p>}
      </div>
    </div>
  );
}