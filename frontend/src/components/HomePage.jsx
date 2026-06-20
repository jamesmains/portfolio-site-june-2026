// frontend/src/components/HomePage.jsx
import ProjectCard from "./ProjectCard";
import { useEffect } from "react";

export default function HomePage({ navigate, projects }) {
  const featured = projects.slice(0, 4);
  const activeCount = projects.filter((p) => p.status === "Active").length;

  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="page">
      <div className="page-inner">
        <div className="hero">
          <div className="hero-eyebrow">// Software Engineer</div>
          <h1 className="hero-title">Building systems<br />that <em>think</em>.</h1>
          <p className="hero-sub">I design and engineer game frameworks, editor tooling, and runtime architectures — with a focus on composable systems that scale without friction.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("gallery")}>View Projects</button>
            <button className="btn btn-outline" onClick={() => navigate("about")}>About Me</button>
          </div>
        </div>

        <div className="home-stats">
          <div className="stat-cell" style={{ paddingLeft: 32 }}>
            <div className="stat-num">{projects.length}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-cell" style={{ paddingLeft: 32 }}>
            <div className="stat-num">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-cell" style={{ paddingLeft: 32 }}>
            <div className="stat-num">{[...new Set(projects.flatMap((p) => p.tags))].length}</div>
            <div className="stat-label">Technologies</div>
          </div>
        </div>

        <div className="home-featured">
          <div className="section-head">
            <div className="hero-eyebrow">// Recent Work</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("gallery")}>View All →</button>
          </div>
          <div className="project-grid project-grid-2">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}