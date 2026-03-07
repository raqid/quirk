# Railway Setup & Operations

## Project Info

- **Project**: quirk
- **Environment**: production
- **Backend URL**: `https://quirk-backend-production-eb81.up.railway.app`
- **Dashboard**: `https://railway.com/project/quirk` (or run `railway open`)

## Services

- **quirk-backend** — Node.js/Express API (auto-deploys from `main`)
- **quirk-web** — Next.js frontend (auto-deploys from `main`)
- **Postgres** — Railway-managed PostgreSQL (proxy at `switchyard.proxy.rlwy.net:55249`)
- **Redis** — used for BullMQ job queues

## Installing the CLI

### macOS (Homebrew)

```bash
brew install railway
```

### npm (cross-platform)

```bash
npm install -g @railway/cli
```

### curl (Linux/macOS)

```bash
curl -fsSL https://railway.com/install.sh | sh
```

### Verify

```bash
railway --version
```

## Authentication

```bash
# Login (opens browser)
railway login

# Login with token (CI/headless)
railway login --browserless

# Check who's logged in
railway whoami

# Logout
railway logout
```

## Linking This Project

The repo must be linked to the Railway project before using most commands.

```bash
# Link interactively (pick project + service from list)
railway link

# Link with a specific project ID
railway link <project-id>

# Check current link
railway status

# Unlink
railway unlink

# Switch the active service context
railway service quirk-backend

# Switch environment
railway environment production
```

## Railway CLI Basics

```bash
# Check current project/service/environment
railway status

# Open project dashboard in browser
railway open

# Open Railway docs
railway docs

# View deploy logs
railway logs

# View logs for a specific service
railway logs --service quirk-backend
```

## Database

### Connection

The `DATABASE_URL` env var is set in Railway and injected at runtime. For local dev, it's in `backend/.env`:

```
DATABASE_URL=postgresql://postgres:<password>@switchyard.proxy.rlwy.net:55249/railway
```

> **Note**: The local `.env` points directly at the Railway Postgres instance (not a local DB). All local migrations and queries hit production. Be careful.

### Connect to Postgres shell

```bash
# Direct psql via Railway CLI (auto-injects credentials)
railway connect postgres

# Or use the DATABASE_URL directly
psql $DATABASE_URL
```

### Run migrations

```bash
# Locally (uses backend/.env DATABASE_URL — hits Railway Postgres directly)
cd backend && bun run migrate

# Via Railway (runs in the cloud environment)
railway run --service quirk-backend bun run migrate

# Rollback
cd backend && bun run migrate:rollback
```

### Quick queries

```bash
# Via Railway connect
railway connect postgres
# then: SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 10;

# One-liner via psql
psql $DATABASE_URL -c "SELECT count(*) FROM waitlist;"
```

### Database tables (current)

| Table | Purpose |
|-------|---------|
| `users` | Contributors — auth, tier, referral codes |
| `wallets` | Balances — available, pending, earned, withdrawn |
| `tasks` | Data collection tasks with pay rates |
| `uploads` | Submitted files — quality score, status |
| `buyers` | Enterprise/AI company accounts |
| `datasets`, `dataset_uploads` | B2B data packaging |
| `transactions`, `royalty_events`, `wallet_transactions` | Financial ledger |
| `payouts` | Withdrawal requests |
| `referral_earnings` | Referrer cuts |
| `notifications` | In-app notifications |
| `waitlist` | Email signups (contributor + enterprise) |

### Backups

Railway Postgres includes automatic daily backups. Access via the dashboard:

1. `railway open` → click the Postgres service → **Backups** tab
2. Point-in-time restore available on paid plans

## Environment Variables

```bash
# List all env vars for current service
railway variables

# Set a variable
railway variables set KEY=value

# Set for a specific service
railway variables set KEY=value --service quirk-backend

# Delete a variable
railway variables delete KEY

# Use Railway env vars to run a local command
railway run --service quirk-backend node script.js
```

### Key env vars (backend)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string (auto-set by Railway) |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Access token signing |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `R2_*` | Cloudflare R2 storage credentials |
| `PORT` | Set by Railway automatically |

## Deploying

Railway auto-deploys on push to `main`. Manual options:

```bash
# Redeploy latest (rebuilds from source)
railway redeploy --service quirk-backend

# Restart without rebuild (just restarts the container)
railway restart --service quirk-backend

# Upload and deploy current directory (bypasses git)
railway up --service quirk-backend
```

### Deploy workflow

1. Push to `main` → Railway detects changes → builds → deploys
2. Backend and web are separate services, each watches the repo
3. Check deploy status: `railway logs --service quirk-backend`
4. If deploy fails: `railway logs --service quirk-backend --num 100` to see build errors

## Custom Domains

```bash
# Add a Railway-generated domain
railway domain --service quirk-web

# Add custom domain
railway domain --service quirk-web --domain quirklabs.ai
```

After adding a custom domain, point your DNS CNAME to the Railway-provided target.

## Volumes

```bash
# Create a persistent volume (e.g. for file storage)
railway volume --service quirk-backend --mount /data
```

## Scaling

```bash
# Scale a service (paid plans)
railway scale --service quirk-backend --replicas 2
```

## Useful Patterns

### Run backend locally with Railway env vars

```bash
cd backend && railway run --service quirk-backend bun run dev
```

This injects all Railway env vars (DATABASE_URL, REDIS_URL, secrets) into the local process — no `.env` file needed.

### Open a shell with all Railway vars

```bash
railway shell --service quirk-backend
# Now you're in a subshell with all env vars available
echo $DATABASE_URL
```

### Check what's deployed

```bash
railway logs --service quirk-backend --num 50
```

### Add a new service

```bash
railway add
```

### SSH into a running service

```bash
railway ssh --service quirk-backend
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `railway status` shows wrong project | Run `railway link` to re-link |
| Deploy stuck | Check `railway logs`, then `railway redeploy` |
| Can't connect to Postgres locally | Verify `DATABASE_URL` in `backend/.env`, check Railway Postgres isn't paused |
| Migration fails in production | Run `railway run --service quirk-backend bun run migrate` to run in cloud context |
| Port binding error | Don't hardcode `PORT` — Railway sets it. Use `process.env.PORT` |
| Build OOM | Check memory limit in dashboard, upgrade plan if needed |
