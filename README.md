# my-figma-backend

Simple Express backend for the MyFigmaApp demo.

Features
- REST endpoints for events and auth
- File-based data persistence (`data.json`) for quick local development
- JWT token responses on login/signup
- Basic admin-only protections for creating/deleting events

Quick start (Windows PowerShell)

```powershell
cd my-figma-backend
npm install
npm start
```

The server runs on port 4000 by default. Use `PORT` env var to change it. Example: `PORT=4300 npm start`.

API
- POST /api/auth/signup  { email, password, role } -> { user, token }
- POST /api/auth/login   { email, password } -> { user, token }
- GET  /api/events       -> [ events ]
- GET  /api/events/:id   -> event
- POST /api/events       -> create event (admin, Authorization: Bearer <token>)
- DELETE /api/events/:id -> delete event (admin)
- GET /api/users         -> list users (admin)

Notes
- This is a development backend. Passwords are stored in plaintext in `data.json` for simplicity. For production, replace with a real database and password hashing.
- The JWT secret is `dev-secret-change-me` by default; set `JWT_SECRET` env var for production.

If you'd like, I can:
- Switch to bcrypt password hashing and demonstrate login with hashed passwords.
- Add an endpoint for the frontend to fetch current user via token.
- Add CORS restrictions or a proxy configuration.



Admin BToken
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyOTMyMzQ3LCJleHAiOjE3NjM1MzcxNDd9.9xztmLfdhnalh7BzblGQG4Tu3V4Qz6uOxD0Q_9LI9b4


User BToken
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxZjhhMzc5LWE1ZGMtNDQzMC1iMGM3LTg4MjZmN2VhMmZkNiIsImVtYWlsIjoiYm9iQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjI5MzMxOTAsImV4cCI6MTc2MzUzNzk5MH0.orUBbZiD4km6LutEKswWp5L_hH9HKcf1mEyMGTGl4b4