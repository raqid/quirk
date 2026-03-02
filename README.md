# Quirk

AI Training Data Marketplace — upload photos/videos/audio, earn payments + royalties.

## Stack

React Native (Expo 52) · Next.js 15 · Node/Express · PostgreSQL/Knex · Redis/BullMQ · Railway

## Prerequisites

- [Bun](https://bun.sh) runtime
- PostgreSQL instance (local or hosted)
- Redis instance (local or hosted)

## Setup

```bash
bun install

# Configure environment
cp backend/.env.example backend/.env  # fill in DATABASE_URL, REDIS_URL, JWT secrets, R2, Resend keys
```

## Running

All commands run from project root:

```bash
# 1. Create database tables
bun run migrate

# 2. Seed demo data (contributor, tasks, uploads, royalties, etc.)
bun run seed

# 3. Start the backend API (port 3000)
bun run dev:backend

# 4. Start the website (landing page + enterprise dashboard)
bun run dev:web

# 5. Start the mobile app
bun run dev:mobile
```

## Testing

```bash
bun run test            # run all tests
bun run test:watch      # watch mode
bun run test:coverage   # with coverage report
```

## All Scripts

| Command | Description |
|---------|-------------|
| `bun run dev:backend` | Start backend with hot reload |
| `bun run dev:web` | Start Next.js dev server |
| `bun run dev:mobile` | Start Expo dev server |
| `bun run seed` | Seed database with demo data |
| `bun run migrate` | Run database migrations |
| `bun run migrate:rollback` | Rollback last migration |
| `bun run build:web` | Build website for production |
| `bun run test` | Run all tests (backend + web) |

## Structure

```
backend/   Express API + BullMQ workers
mobile/    Expo managed workflow (React Native)
web/       Next.js landing page + enterprise dashboard
```

API base: `/api/v1/` — see `backend/src/app.js` for all routes.
