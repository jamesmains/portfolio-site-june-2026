// frontend/src/components/AboutPage.jsx
import { useEffect } from "react";

export default function AboutPage() {
  const skills = [
    { cat: "Languages", items: ["C#", "JavaScript", "Python", "HLSL"] },
    { cat: "Engines", items: ["Unity", "Unreal (basics)"] },
    { cat: "Tooling", items: ["UIElements", "Editor scripting", "AssetDatabase"] },
    { cat: "Architecture", items: ["ECS patterns", "ScriptableObject design", "State machines"] },
    { cat: "Infrastructure", items: ["Git", "CI/CD", "Bash"] },
    { cat: "Other", items: ["JSON serialisation", "Audio DSP basics", "Shader graph"] },
  ];

  useEffect(() => {
      document.title = "About";
    }, []);

  return (
    <div className="page">
      <div className="page-inner">
        <div className="about-hero">
          <div>
            <h1 className="about-name">Jim <span>_</span><br />Software Engineer</h1>
            <div className="about-body">
              <p>I build systems that other engineers want to work inside. My focus is game frameworks, editor tooling, and runtime architectures that reduce cognitive overhead and let teams ship faster.</p>
              <p>Right now I'm deep in my own custom development environments — optimizing clean-slate workflows.</p>
            </div>
          </div>
          <div className="about-aside">
            <div className="aside-block">
              <div className="aside-label">Contact</div>
              <ul className="aside-list">
                <li><a href="mailto:Contact@Tyler-Sims.com">Contact@Tyler-Sims.com</a></li>
                <li><a href="https://github.com/jamesmains?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <div className="hero-eyebrow">// Skills</div>
          <div className="skills-grid">
            {skills.map((s) => (
              <div key={s.cat} className="skill-cell">
                <strong>{s.cat}</strong>
                {s.items.join(", ")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}