# Full-Stack Engineering Portfolio

A modern, light-weight developer portfolio featuring a dynamic project showcase powered by a decoupled React frontend and a secured Node.js/Express CRUD API. 

## Architecture Overview

This portfolio is built using an isolated multi-tier architecture, abandoning fragile frontend mocks for a fully operational database-driven management layer.

* **Frontend:** React (Vite), leveraging a clean, single-page UI built for high performance and fast readability.
* **Backend:** Node.js + Express REST API managing cross-origin requests, structured data pipelines, and administrative routing.
* **Database:** SQLite for lightweight, transactional, zero-configuration local data storage.
* **Production/Ops:** Deployed on a Linux (Linode VPS) instance using an Nginx Reverse Proxy, PM2 Process Management, and automated SSL encryption via Let's Encrypt.

---

## Technical Highlights

* **Custom Admin Panel:** Secured backend dashboard capable of handling dynamic updates (Upsert operations) to add or edit live portfolio entries.
* **Isolated Data Management:** Independent `POST`, `PUT`, and `DELETE` routes ensuring complete separation of concerns between layout styling and data flow.
* **Reverse Proxy Routing:** Nginx acts as the front door, serving optimized static frontend bundles directly while proxying `/api` traffic back to the Express server.
* **State Control & Security:** Built utilizing HTTP-only session cookies and centralized environment variables (`.env`) to ensure production credentials never touch client-side builds.

---

## Local Development Setup

### 1. Prerequisites
* Node.js (v18+)
* npm

### 2. Backend Configuration
Navigate to the `backend` directory, install dependencies, and configure your local environment:

`cd backend`
`npm install`

Create a .env file in the root of the backend directory with the following information:
`PORT=5050`
`REAL_ADMIN_PASSWORD="your_local_secure_password"`
`SESSION_SECRET="your_local_session_secret"`

Start with 
`node server.js`

### 3. Frontend Configuration
`cd ../frontend`
`npm install`
`npm run dev`