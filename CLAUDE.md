# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Quirk** — AI Training Data Marketplace. Contributors upload photos/videos/audio, earn upfront payments + ongoing royalties when their data is purchased by AI companies.

**Stack**: React Native (Expo SDK 52) + Node.js/Express + PostgreSQL/Knex + Redis + BullMQ + Railway

## Development Commands

```bash
# Backend (from backend/)
bun run dev              # Start with --watch (hot reload), PORT=3000
bun start                # Production start
bun run migrate          # knex migrate:latest
bun run migrate:rollback # knex migrate:rollback

# Mobile (from mobile/)
bunx expo start           # Dev server, press 'i' for iOS simulator

# IMPORTANT: Use zsh -lc '...' for all shell commands (bun/node require login shell)
```

**No test runner, linter, or formatter is configured.** Verify changes manually.

## Monorepo Structure

```
the-quirk/
├── backend/           Node.js + Express + Knex + PostgreSQL + Redis + BullMQ
│   ├── src/
│   │   ├── app.js         Express app setup + route mounting
│   │   ├── server.js      HTTP listener + worker registration
│   │   ├── routes/        API route handlers
│   │   ├── admin-routes/  Admin-only endpoints
│   │   ├── middleware/    auth, adminAuth, rateLimiter, errorHandler
│   │   ├── workers/       BullMQ job processors
│   │   └── config/        db.js (knex), redis.js (ioredis), queues.js
│   ├── migrations/        Knex migrations (ES module exports)
│   └── knexfile.js        Dev (no SSL) + production (SSL) configs
└── mobile/            React Native + Expo managed workflow
    ├── App.jsx            Root: auth check → AuthNavigator or AppNavigator
    ├── metro.config.js    Fixes axios crypto polyfill
    └── src/
        ├── navigation/    AppNavigator (tabs + stack), AuthNavigator
        ├── screens/       18 screen components
        ├── components/    Reusable UI
        ├── services/      api.js (axios + auth interceptor), storage.js
        ├── context/       AuthContext.js
        ├── theme/         colors.js, typography.js, spacing.js
        └── utils/         formatting.js
```

## Architecture

### Backend

**ES modules only** — `"type": "module"` in package.json. Always `import`/`export`, never `require()`.

**Middleware chain**: `cors() → express.json() → rateLimiter (100/15min) → routes → errorHandler`

**All routes mount at `/api/v1/`** in `app.js`:
- User routes: `auth`, `uploads`, `tasks`, `wallet`, `royalties`, `referrals`, `notifications`, `profile`
- Admin routes: `admin/submissions`, `admin/tasks`, `admin/contributors`, `admin/buyers`, `admin/datasets`, `admin/transactions`, `admin/analytics`

**Auth**: JWT access + refresh tokens. `authenticate()` middleware verifies Bearer token, attaches `req.user`. Admin routes additionally check `role === 'admin'` via `adminAuth.js`. Stricter `authLimiter` (20/15min) available for auth routes.

**BullMQ queues** (defined in `config/queues.js`):
| Queue | Worker | Purpose |
|-------|--------|---------|
| `upload-processing` | `processUpload.js` | Post-upload quality scoring |
| `royalty-distribution` | `distributeRoyalties.js` | Royalty pool splits |
| `referral-royalty` | `referralRoyalty.js` | Referrer cuts |
| `payout-processing` | `processPayout.js` | Withdrawal processing |
| `weekly-summary` | `weeklySummary.js` | Scheduled digest |

**Database schema** (single initial migration `20240101000000`):
- `users` — uuid pk, email/phone, level (bronze→platinum), role, referral_code, OTP fields, streak_days
- `wallets` — balances (available, pending, total_earned, total_royalties, total_withdrawn)
- `tasks` — data collection tasks with pay_per_submission, royalty_rate, quantity tracking
- `uploads` — file_key (R2), quality_score, status (processing/approved/rejected/removed/pending)
- `buyers`, `datasets`, `dataset_uploads` — B2B data purchasing
- `transactions`, `royalty_events`, `wallet_transactions` — financial ledger
- `payouts`, `referral_earnings`, `notifications`

New migrations: `backend/migrations/` with timestamp prefix, ES module `export async function up/down`.

### Mobile

**Production API**: `https://quirk-backend-production-eb81.up.railway.app/api/v1` (hardcoded in `services/api.js`)

**Auth flow**: `App.jsx` checks SecureStore for token → renders `AuthNavigator` (Welcome→Signup→Verify→Profile→Tutorial) or `AppNavigator`.

**Navigation**:
- Bottom tabs: Home, Tasks, Capture (elevated FAB), Earn, Wallet
- Stack screens pushed over tabs: TaskDetail, AssetDetail, UploadMetadata, Profile, Notifications, Leaderboard, Settings

**API layer** (`services/api.js`): Axios instance with request interceptor (attaches Bearer token) and response interceptor (auto-refreshes on 401, retries once).

**Theme** (dark mode, primary green `#00E676`, background `#0A0A0A`):
- Always use tokens from `theme/colors.js`, `theme/typography.js`, `theme/spacing.js`
- Never hardcode colors or spacing values

## Code Rules

- `StyleSheet.create()` for all styles — no inline styles
- Screens must use `SafeAreaView` + `StatusBar barStyle="light-content"`
- New API functions go in `services/api.js` following existing patterns
- New routes mount in `backend/src/app.js`
- Knex queries use async/await
- Fix bugs minimally — never refactor while fixing
- Never commit unless explicitly requested
- Never suppress errors or use empty catch blocks

## Planning & Task Tracking

- **Always check `plans/todo.md` at the start of a session** to understand current project state
- Before starting multi-step work, create or update a plan file in `plans/` and link it from `todo.md`
- Update `plans/todo.md` as tasks progress — mark items done, add new items, move between sections
- `docs/` is for project documentation; `plans/` is for task tracking and implementation plans
- Plan files should be named descriptively: `plans/add-stripe-payouts.md`, `plans/refactor-auth.md`, etc.

## Behavioral Instructions

- **Do not implement unless the user explicitly asks for implementation**
- Start work immediately — no acknowledgments or preamble
- Don't summarize or explain unless asked
- Match the user's communication style
- If the user's design seems flawed, raise the concern before implementing
- If scope is ambiguous with 2x+ effort difference between interpretations, ask
- After 3 consecutive fix failures: stop, revert, document, ask user
