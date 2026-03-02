# Quirk

AI Training Data Marketplace — upload photos/videos/audio, earn payments + royalties.

## Stack

React Native (Expo 52) · Node/Express · PostgreSQL/Knex · Redis/BullMQ · Railway

## Setup

```bash
# Backend
cd backend && bun install
cp .env.example .env  # fill in DB, Redis, R2, Resend keys
bun run migrate
bun run dev

# Mobile
cd mobile && bun install
bunx expo start
```

## Structure

```
backend/   Express API + BullMQ workers
mobile/    Expo managed workflow
```

API base: `/api/v1/` — see `backend/src/app.js` for all routes.
