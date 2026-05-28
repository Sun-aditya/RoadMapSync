# 🚀 RoadMapSync: Gamified Learning Roadmaps

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A highly interactive, gamified learning platform designed to help software engineers master complex fields like DevOps, Web Development, and Cybersecurity through visually engaging, deeply nested skill trees. 

Unlike static lists, DevTree provides a dynamic learning experience with progress tracking, capstone project validation, and satisfying visual milestones.

---

## ✨ Features

### 🔒 Secure Authentication
* Full JWT-based user authentication system.
* Secure password hashing using `bcrypt`.
* Protected frontend routes restricting access to authenticated learners.

### 🗺️ Interactive Skill Trees
* **Deeply Nested Roadmaps:** Major milestones break down into actionable micro-steps (e.g., `Linux -> Basic Commands -> Shell Scripting`).
* **Fluid Animations:** Smooth stagger-fade transitions using Framer Motion as users navigate through the timeline.
* **Celebration Logic:** Completing capstone projects triggers a visual `canvas-confetti` celebration and smoothly unlocks the next learning tier.

### 🎨 Design Philosophy
Built with a **Warm Minimalist Aesthetic**. Moving away from generic dark modes, the UI utilizes off-whites, creams, and deep charcoals to create a premium, readable, and distraction-free learning environment.

### 🚧 Upcoming Features (In Development)
* **Database-Driven Progress Tracking:** Persisting micro-step progress directly to the TiDB serverless database.
* **Multiplayer Squads & Rooms:** Private learning rooms with point-based leaderboards for friendly competition.
* **Proof of Work Validation:** Modal submissions requiring live URLs and GitHub repositories for capstone projects.

---

## 🛠️ Tech Stack

**Frontend:**
* React 18 (Vite)
* Tailwind CSS
* Framer Motion & Canvas Confetti
* React Router DOM
* Axios

**Backend:**
* Node.js & Express.js
* MySQL2 (Promise-based)
* JSONWebToken (JWT) & Bcrypt

**Database:**
* TiDB Cloud (Serverless MySQL-compatible database)
* Enforced SSL/TLS connections

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a TiDB Cloud database provisioned. 

### Installation

**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
cd your-repo-name
2. Set up the Backend:

Bash
cd backend
npm install
3. Configure Environment Variables:
Create a .env file in the backend directory:

Code snippet
DB_HOST=your-tidb-host.tidbcloud.com
DB_PORT=4000
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=roadmap_db
JWT_SECRET=your_super_secret_key
4. Start the Backend Server:
Make sure you have executed your schema.sql in your database, then run:

Bash
node server.js
5. Set up the Frontend:
Open a new terminal window:

Bash
cd frontend
npm install
npm run dev
6. Explore: Open http://localhost:5173 in your browser.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page
