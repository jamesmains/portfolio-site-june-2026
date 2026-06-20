// frontend/src/components/AdminPanel.jsx
import { useState, useMemo } from "react";
import StatusTag from "./StatusTag";
import ProjectModal from "./ProjectModal";
import { useEffect } from "react";

const ALL_STATUSES = ["Active", "Complete", "Archived", "In Progress"];

export default function AdminPanel({ projects, refreshProjects, onLogout }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editing, setEditing] = useState(null);

    useEffect(() => {
      document.title = "Admin";
    }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const handleSave = async (projectForm) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm)
      });

      if (response.ok) {
        refreshProjects();
        setEditing(null);
      }
    } catch (err) {
      console.error("Error committing project modification:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        refreshProjects();
      }
    } catch (err) {
      console.error("Failed to delete database row:", err);
    }
  };

  return (
    <div className="page">
      <div className="page-inner">
        <div className="admin-wrap">
          <div className="admin-header">
            <div>
              <div className="admin-title">Admin Dashboard</div>
              <div className="hero-eyebrow">// {projects.length} SQL records tracking live</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing("new")}>+ New Project</button>
              <button className="btn btn-outline btn-sm" onClick={onLogout}>Log Out</button>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="search-input-wrap">
              <span className="search-icon">//</span>
              <input className="search-input" placeholder="Search parameters..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="select-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">No database rows match filter configuration.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-title">{p.title}</div>
                      <div className="table-desc">{p.description}</div>
                    </td>
                    <td>
                      <div className="card-tags">
                        {p.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </td>
                    <td><StatusTag status={p.status} /></td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{p.year}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <ProjectModal project={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}