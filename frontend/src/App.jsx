// frontend/src/App.jsx
import { useState, useEffect, useCallback } from "react";
import "./styles.css"; // import base styles

// 2. Import Isolated Component Modules
import HomePage from "./components/HomePage";
import GalleryPage from "./components/GalleryPage";
import AboutPage from "./components/AboutPage";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [page, setPage] = useState("home");
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const loadProjectsFromDB = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed structural alignment with SQLite target:", error);
    }
  };

  useEffect(() => {
    loadProjectsFromDB();
  }, []);

  const year = new Date().getFullYear();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await response.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        setLoginError('');
        setPage('admin');
      } else {
        setLoginError(data.message || "Access denied.");
      }
    } catch (err) {
      setLoginError("Could not clear authentication handshake.");
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setPage('home');
  };

  const navigate = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <button className="logo" onClick={() => navigate("home")}><span>{"// "}</span>TYLER SIMS</button>
          <nav className="nav">
            <button className={`nav-link${page === "home" ? " active" : ""}`} onClick={() => navigate("home")}>Home</button>
            <button className={`nav-link${page === "gallery" ? " active" : ""}`} onClick={() => navigate("gallery")}>Gallery</button>
            <button className={`nav-link${page === "about" ? " active" : ""}`} onClick={() => navigate("about")}>About</button>
            <button className={`nav-link${page === "admin" ? " active" : ""}`} onClick={() => navigate("admin")}>Admin</button>
          </nav>
        </div>
      </header>

      {page === "home" && <HomePage navigate={navigate} projects={projects} />}
      {page === "gallery" && <GalleryPage projects={projects} />}
      {page === "about" && <AboutPage />}
      
      {page === "admin" && (
        isLoggedIn ? (
          <AdminPanel projects={projects} refreshProjects={loadProjectsFromDB} onLogout={handleLogout} />
        ) : (
          <div className="page">
            <div className="login-wrap">
              <div className="login-box">
                <div className="login-title">Admin Access</div>
                <div className="login-sub">Session authorization required.</div>
                <div className="login-sub">I've left this page visible because there are easter eggs in it!
                However if you do manage to get in please contact me at <a href="mailto:Contact@Tyler-Sims.com">Contact@Tyler-Sims.com</a>, I'd like to get it fixed!
                <br />
                </div>
                <form onSubmit={handleLoginSubmit}>
                  <div className="field">
                    <label className="field-label">Secret Key</label>
                    <input className={`field-input${loginError ? " error-input" : ""}`} type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" />
                    {loginError && <div className="error-msg">{loginError}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Unlock Panel</button>
                </form>
              </div>
            </div>
          </div>
        )
      )}
      <footer className="footer">
        <div className="footer-inner">
          <span>&copy; {year} Jim Sims. All rights reserved.</span>
          <br />
          <span>Built with React, Node.js, and a sprinkle of caffeine.</span>
        </div>
      </footer>
      <script>

</script>
    </>
    
  );
}