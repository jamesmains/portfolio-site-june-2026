import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,              // Prevents client-side JS from accessing the cookie
    secure: false,               // Todo: Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));

// Declare a database variable we can access across our routes
let db;

// ─── DATABASE INITIALIZATION ────────────────────────────────────────────────
async function initDatabase() {
  db = await open({
    filename: './portfolio.db',
    driver: sqlite3.Database
  });

  // Keep the structural blueprint intact
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      tags TEXT,
      status TEXT,
      year TEXT,
      description TEXT,
      link TEXT,
      image TEXT
    )
  `);

  // Clean Slate: No loops, no mock projects. Just a clean log.
  console.log("🗄️ SQLite connection active. Awaiting fresh data rows.");
}

app.get('/api/projects', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM projects ORDER BY id DESC');
    
    // Format the tags back into a clean array for React before sending
    const formattedRows = rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    }));

    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve projects from database." });
  }
});

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next(); // They have the cookie! Let them pass to the actual route logic.
  } else {
    res.status(403).json({ error: "Unauthorized. Nice try!" });
  }
};

// 5. SECURE ROUTE TO ADD A NEW PROJECT
app.post('/api/projects', requireAdmin, async (req, res) => {
  const { id, title, tags, status, year, description, link, image } = req.body;
  
  try {
    // Join array of tags into a single string for SQLite storage
    const tagsString = Array.isArray(tags) ? tags.join(',') : '';
    await db.run(`
      INSERT INTO projects (id, title, tags, status, year, description, link, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, tags = EXCLUDED.tags, status = EXCLUDED.status, year = EXCLUDED.year, description = EXCLUDED.description, link = EXCLUDED.link, image = EXCLUDED.image;
    `, [id, title, tagsString, status, year, description, link, image]);

    res.json({ success: true, message: "Project created in SQLite successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to write to database." });
  }
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project from database." });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password required." });
  }

  // Easter Egg 1: The default template pass
  if (password === "gnomes2026") {
    return res.status(418).json({ 
      success: false, 
      message: "Did you really think that would work?" 
    });
  }

  // Easter Egg 2: The console "leak" honeypot
  if (password === "placeholderpass123") {
    return res.status(418).json({ 
      success: false, 
      message: "Access Granted... to the Secret Order of the Console Snoopers. (Nice try, but I don't leave real keys in the frontend!)" 
    });
  }

  // The Real Security Check
  if (password === process.env.REAL_ADMIN_PASSWORD) {
    // In a production app, you'd send back a secure token (JWT) here.
    // For now, we return authorization success safely verified by the server.
    req.session.isAdmin = true; // Mark this session as authenticated
    return res.json({ success: true, message: "Welcome back, Admin." });
  }

    // Fallback for wrong passwords
  return res.status(401).json({ success: false, message: "Invalid key. Access denied." });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Could not log out." });
    res.clearCookie('connect.sid'); // Clears the cookie from the browser
    return res.json({ success: true, message: "Logged out safely." });
  });
});

// Start the server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server + Database alive on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to initialize database:", err);
});