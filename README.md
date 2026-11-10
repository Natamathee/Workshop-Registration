# Workshop Registration System

A full-stack web application for discovering and registering for workshops. Members can browse and register for upcoming workshops, while admins can manage the workshop catalog and all registrations.

## Live Demo

- **Frontend:** https://workshop-registration-gilt.vercel.app
- **Backend API:** https://workshop-backend-w4og.onrender.com
- **API Docs (Swagger):** https://workshop-backend-w4og.onrender.com/api-docs

> Note: The backend runs on Render's free tier and may take 30–60 seconds to wake up after inactivity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose 8 |
| Auth | JWT (Bearer token), bcryptjs |
| Docs | Swagger / OpenAPI 3 |
| Deploy | Vercel (frontend), Render (backend) |

## Project Structure

```
├── backend/        Node.js + Express REST API
├── frontend/       React + Vite + Tailwind CSS
├── DEMO.md         Step-by-step demo guide
└── README.md
```

## Features

### Member
- Register and log in with email and password
- Browse and search workshops by name, instructor, description, or location
- Register for any active upcoming workshop
- View, edit (move to another workshop), and cancel own registrations
- Maximum 3 active registrations at a time

### Admin
- All member capabilities (except creating registrations)
- Create, edit, and delete workshops
- View, edit, and delete any member's registrations

### Business Rules
- Workshop date must be today or in the future
- Registration count cannot exceed workshop capacity
- A member cannot register for the same workshop twice
- A member can hold at most 3 active registrations

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)

### Backend

```bash
cd backend
npm ci
```

Copy the example config and fill in your values:

```bash
cp config/config.env.example config/config.env
```

```dotenv
NODE_ENV=development
PORT=5001
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

Seed sample data (users + workshops):

```bash
node seed.js
```

### Frontend

```bash
cd frontend
npm ci
```

Create a `.env` file:

```dotenv
VITE_API_URL=http://localhost:5001/api/v1
```

```bash
npm run dev
```

Open http://localhost:3000

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@workshop.com | Admin1234! |
| Member | alice@workshop.com | Member1234! |
| Member | bob@workshop.com | Member1234! |

## API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/auth/me` | Authenticated |
| GET | `/api/v1/auth/logout` | Authenticated |
| GET | `/api/v1/workshops` | Public |
| GET | `/api/v1/workshops/:id` | Public |
| POST | `/api/v1/workshops` | Admin |
| PUT | `/api/v1/workshops/:id` | Admin |
| DELETE | `/api/v1/workshops/:id` | Admin |
| GET | `/api/v1/registrations` | Authenticated |
| GET | `/api/v1/registrations/:id` | Owner or Admin |
| POST | `/api/v1/registrations` | Member |
| PUT | `/api/v1/registrations/:id` | Owner or Admin |
| DELETE | `/api/v1/registrations/:id` | Owner or Admin |

Full documentation available at `/api-docs`.
