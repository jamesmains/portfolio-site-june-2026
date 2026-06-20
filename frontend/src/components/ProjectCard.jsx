// frontend/src/components/ProjectCard.jsx
import StatusTag from "./StatusTag";

export default function ProjectCard({ project }) {
  if (project.link) { 
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card">
        <div className="card-top">
          <div className="card-title">{project.title}</div>
          <div className="card-year">{project.year}</div>
        </div>
        <div className="card-desc">{project.description}</div>
        <div className="card-tags">
          <StatusTag status={project.status} />
          {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </a>
    );
  } 
  else {
    return (
      <div className="project-card">
        <div className="card-top">
          <div className="card-title">{project.title}</div>
          <div className="card-year">{project.year}</div>
        </div>
        <div className="card-desc">{project.description}</div>
        <div className="card-tags">
          <StatusTag status={project.status} />
          {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    );
  }
}