# TaskFlow - SaaS Task Manager

A full-stack, multi-user task management application built with Node.js, Express, MongoDB, and React.

## Features
- Secure JWT Authentication
- Multi-user data isolation
- Task CRUD (Create, Read, Update, Delete)
- Task Search & Filtering
- Responsive, Premium Design
- MongoDB Atlas Integration

## Project Structure
```
task-manager-saas/
├── backend/           # Node.js Express API
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth protection
│   ├── models/        # Database schemas
│   ├── routes/        # API endpoints
│   └── server.js      # Entry point
└── frontend/          # React Vite App
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── context/    # Auth state
    │   ├── pages/      # Route pages
    │   └── App.jsx     # Main routing
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to `backend/` folder.
2. Run `npm install`.
3. Create a `.env` file (template provided).
4. Add your **MongoDB Atlas Connection String** to `MONGO_URI`.
5. Set a secure `JWT_SECRET`.
6. Start server: `npm run dev` (uses nodemon) or `node server.js`.

### 2. Frontend Setup
1. Navigate to `frontend/` folder.
2. Run `npm install`.
3. Start development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## Cloud Deployment Instructions

### Backend (Render / Heroku)
1. Push the code to a GitHub repository.
2. Connect the repository to Render/Heroku.
3. Set the root directory to `backend`.
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in the platform's dashboard.
5. Deploy.

### Frontend (Vercel / Netlify)
1. Connect the repository to Vercel/Netlify.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Deploy.

> **Note**: Update the `API_URL` in `frontend/src/context/AuthContext.jsx` and `Dashboard.jsx` to point to your deployed backend URL.
