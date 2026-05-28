# RoadMap

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

RoadMap is a full-stack learning roadmap app with a React + Vite frontend and a Node.js + Express backend. It helps users explore curated engineering tracks, track progress through milestones, and unlock achievements as they move through each roadmap.

## Features

- Interactive roadmap browsing and selection
- User authentication with JWT and bcrypt
- Progress tracking for roadmap milestones and checkpoints
- Achievement unlocks and capstone-style milestones
- MySQL-backed persistence with seeded roadmap content

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- Backend: Node.js, Express, MySQL2, JSON Web Token, bcrypt
- Database: MySQL-compatible schema defined in `backend/schema.sql`

## Project Structure

- `backend/` - API server, database connection, routes, middleware, and seed logic
- `frontend/` - Vite app, pages, components, styles, and client-side services

## Prerequisites

- Node.js 18 or later
- MySQL 8 or a compatible MySQL database

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd RoadMap
```

### 2. Set up the database

Create a database named `roadmap_db` or update the name in `backend/.env` to match your database.

Run the schema file:

```bash
mysql -u <your-user> -p roadmap_db < backend/schema.sql
```

### 3. Configure the backend

Create `backend/.env` with the following values:

```env
DB_HOST=localhost
DB_PORT=4000
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=roadmap_db
JWT_SECRET=your_long_random_secret
PORT=3000
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 6. Start the app

Open two terminals and run:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on the Vite dev server and the backend listens on port `3000` by default.

## Backend Notes

- The backend seeds roadmap content automatically on startup.
- The database connection is configured in `backend/db.js`.
- The server creates additional tables such as achievements and roadmap progress snapshots if they are missing.

## Available Scripts

### Backend

- `npm start` - run the server normally
- `npm run dev` - run the server with Node watch mode

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Environment Files

Keep local secrets out of Git. The repository ignores `.env` files, while `backend/.env.example` and similar examples can be committed if needed.

## Contributing

Issues and pull requests are welcome. If you change the database schema or seeded roadmap content, update the setup instructions as needed.
