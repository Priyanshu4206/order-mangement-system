# QR-Based Restaurant Order Management System

## Overview
A robust, offline-tolerant, and scalable restaurant order management system for self-service ordering via QR codes. Built for easy deployment in environments like malls, with a focus on reliability and maintainability.

## Project Structure

- `backend/` — Node.js/Express API, SQLite (via Prisma ORM)
- `frontend/` — React.js app (Zustand for state, Styled Components for UI)
- `shared/` — (optional) Shared types/config

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Configure environment variables in `.env` (see sample in backend/)
4. `npx prisma migrate dev --name init`
5. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Features
- Customer QR-based menu and ordering
- Real-time kitchen/admin dashboards
- Offline support
- Easy deployment and maintenance

See `Todos.md` and `ChangeLog.md` for progress and updates. 