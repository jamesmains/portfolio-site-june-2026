// frontend/src/components/GalleryPage.jsx
import { useState, useMemo, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import { useEffect } from "react";

const quips = [
    "Games, Tools, and other Forgotten Things" ,
    "Games, Tools, and other Poorly Documented Things",
    "There were more projects here yesterday, I swear.",
    "My harddrive with all my other projects crashed; always back up your work, kids.",

  ];

const ALL_STATUSES = ["Active", "Complete", "Archived", "In Progress"];
const PER_PAGE = 6;

export default function GalleryPage({ projects }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
      document.title = "Gallery";
    }, []);

  // Compute unique tags from whatever projects are currently in the SQL database
  const allTags = useMemo(
    () => ["All", ...new Set(projects.flatMap((p) => p.tags))].sort((a, b) =>
      a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)
    ),
    [projects]
  );

  // Apply filters to our database rows
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchTag = tagFilter === "All" || p.tags.includes(tagFilter);
      return matchStatus && matchTag;
    });
  }, [projects, statusFilter, tagFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterChange = useCallback((setter, value) => {
    setter(value);
    setPage(1); // Reset back to page 1 whenever filters shift
  }, []);

  return (
    <div className="page">
      <div className="page-inner">
        <div className="gallery-hero">
          <span className="hero-eyebrow">// {quips[Math.floor(Math.random() * quips.length)]}</span>
          <h1 className="gallery-title">Project Gallery</h1>
          <div className="gallery-sub">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} matching filters
          </div>
        </div>

        <div className="gallery-filters">

          <div>
            <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 8px" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginRight: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Status:</span>
            {["All", ...ALL_STATUSES].map((s) => (
              <button key={s} className={`filter-btn${statusFilter === s ? " active" : ""}`} onClick={() => handleFilterChange(setStatusFilter, s)}>{s}</button>
            ))}
          </div>
          <div>
            <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 8px" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginRight: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Tag:</span>
            {allTags.slice(0, 8).map((t) => (
              <button key={t} className={`filter-btn${tagFilter === t ? " active" : ""}`} onClick={() => handleFilterChange(setTagFilter, t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="gallery-list">
          {pageItems.length === 0 ? (
            <div className="empty-state">No projects match the selected filters.</div>
          ) : (
            <div className="project-grid project-grid-2">
              {pageItems.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`filter-btn page-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}