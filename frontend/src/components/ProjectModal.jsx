// frontend/src/components/ProjectModal.jsx
import { useState } from "react";

const ALL_STATUSES = ["Active", "Complete", "Archived", "In Progress"];

export default function ProjectModal({ project, onSave, onClose }) {
    const isNew = !project;
    const [form, setForm] = useState(
        project || { title: "", description: "", tags: [], status: "Active", year: new Date().getFullYear().toString(), link: "", image: "" }
    );
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
        setTagInput("");
    };

    const removeTag = (t) => set("tags", form.tags.filter((x) => x !== t));

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required.";
        if (!form.description.trim()) e.description = "Description is required.";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        onSave(form);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel">
                <div className="modal-head">
                    <div>
                        <div className="modal-title">{isNew ? "New Project" : "Edit Project"}</div>
                        <div className="modal-sub">{isNew ? "Add a project to the gallery." : `Editing: ${project.title}`}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="field">
                    <label className="field-label">Title</label>
                    <input className={`field-input${errors.title ? " error-input" : ""}`} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Project name" />
                    {errors.title && <div className="error-msg">{errors.title}</div>}
                </div>

                <div className="field">
                    <label className="field-label">Description</label>
                    <textarea className={`field-input field-textarea${errors.description ? " error-input" : ""}`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What did you build?" />
                    {errors.description && <div className="error-msg">{errors.description}</div>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                        <label className="field-label">Status</label>
                        <select className="field-input select-input" value={form.status} onChange={(e) => set("status", e.target.value)} style={{ width: "100%" }}>
                            {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="field">
                        <label className="field-label">Year</label>
                        <input className="field-input" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" />
                    </div>
                </div>

                <div className="field">
                    <label className="field-label">Link</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input className="field-input" style={{ flex: 1 }} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="e.g. https://example.com" />
                    </div>
                </div>

                <div className="field">
                    <label className="field-label">Tags</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input className="field-input" style={{ flex: 1 }} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} placeholder="e.g. Unity, C#" />
                        <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>Add</button>
                    </div>
                    {form.tags.length > 0 && (
                        <div className="tags-input-wrap">
                            {form.tags.map((t) => (
                                <span key={t} className="tag-removable">{t}
                                    <button type="button" className="tag-remove-btn" onClick={() => removeTag(t)}>×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleSave}>{isNew ? "Create Project" : "Save Changes"}</button>
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}