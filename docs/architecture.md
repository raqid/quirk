# Quirk — System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONTRIBUTOR APP                              │
│                    React Native + Expo SDK 52                       │
│                                                                     │
│  Auth Flow ──→ Task Feed ──→ Capture ──→ Upload ──→ Portfolio/Wallet│
│  (JWT)         (browse)     (camera)    (R2)       (earnings)       │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTPS (axios)
                          │ Bearer JWT
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API SERVER                                  │
│                   Node.js + Express (ES modules)                    │
│                                                                     │
│  Middleware: cors → json → rateLimiter(100/15m) → routes → errHandler│
│                                                                     │
│  /api/v1/auth          JWT issue + refresh, OTP via Resend          │
│  /api/v1/tasks         Browse + filter active tasks                 │
│  /api/v1/uploads       Presign → R2 → complete → queue job          │
│  /api/v1/wallet        Balance, transactions, withdraw              │
│  /api/v1/royalties     Royalty events + summary                     │
│  /api/v1/referrals     Referral code, earnings                      │
│  /api/v1/notifications List, mark read                              │
│  /api/v1/profile       Stats, portfolio, leaderboard, push token    │
│  /api/v1/admin/*       7 admin route groups (no frontend yet)       │
└──────┬──────────────────┬──────────────────┬────────────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│PostgreSQL│     │    Redis     │     │ Cloudflare R2│
│  (Knex)  │     │  (ioredis)  │     │  (S3 compat) │
│          │     │             │     │              │
│ 13 tables│     │ BullMQ jobs │     │ Media files  │
│ see below│     │ Rate limits │     │ Presigned URL│
└──────────┘     └──────┬──────┘     └──────────────┘
                        │
                        ▼
              ┌───────────────────┐
              │   BullMQ Workers  │
              │                   │
              │ upload-processing │  → quality score + auto-approve
              │ royalty-distrib.  │  → split pool across uploads
              │ referral-royalty  │  → 10% referrer cut
              │ payout-processing │  → mark complete (STUB)
              │ weekly-summary    │  → cron Mon 8am notifications
              └───────────────────┘
```

## Database Schema (13 tables)

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  users   │───→│ wallets  │    │  tasks   │
│          │    │          │    │          │
│ uuid pk  │    │ balances │    │ pay rate │
│ email    │    │ payout   │    │ royalty  │
│ phone    │    │ method   │    │ quantity │
│ level    │    └──────────┘    │ type     │
│ role     │                    └────┬─────┘
│ referral │                         │
└────┬─────┘                         │
     │                               │
     │         ┌─────────────────────┘
     ▼         ▼
┌──────────────────┐     ┌────────────────┐
│     uploads      │────→│  royalty_events │
│                  │     │                │
│ file_key (R2)    │     │ from txn       │
│ quality_score    │     │ amount per     │
│ status           │     │ upload         │
│ upfront_payment  │     └────────────────┘
│ usage_count      │
└──────────────────┘
         │
         │ (included in)
         ▼
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│ dataset_uploads  │────→│   datasets   │────→│ transactions │
│ (junction)       │     │              │     │              │
└──────────────────┘     │ filters json │     │ buyer_id     │
                         └──────────────┘     │ amount       │
                                              │ royalty_pool │
┌──────────────────┐                          └──────────────┘
│     buyers       │
│                  │     ┌──────────────────┐
│ company_name     │     │wallet_transactions│  ← financial ledger
│ api_key          │     │                  │
└──────────────────┘     │ type: upfront /  │
                         │  royalty / payout │
┌──────────────────┐     │  / referral /    │
│     payouts      │     │  bonus           │
│                  │     └──────────────────┘
│ status           │
│ external_txn_id  │     ┌──────────────────┐
└──────────────────┘     │referral_earnings │
                         │                  │
┌──────────────────┐     │ referrer → user  │
│  notifications   │     └──────────────────┘
│                  │
│ type, title, body│
│ read flag        │
└──────────────────┘
```

## Data Flow: Upload → Earn → Royalty

```
1. UPLOAD
   Contributor taps Capture
   → expo-image-picker opens camera
   → POST /uploads/presign (gets R2 presigned URL)
   → PUT to R2 (direct upload)
   → POST /uploads/complete (creates DB record)
   → BullMQ: upload-processing job queued

2. PROCESS
   Worker picks up job
   → Generates quality_score (STUB: random 60-95)
   → If task.auto_approve && score >= min:
     - Status → approved
     - Wallet += upfront_payment
     - wallet_transaction created
     - Notification sent
   → Else: stays in 'processing' for admin review

3. ADMIN REVIEW (manual)
   Admin hits PATCH /admin/submissions/:id/approve
   → Status → approved
   → Wallet += upfront_payment
   → Task fill counts updated
   → Notification sent

4. DATASET + SALE
   Admin creates dataset (POST /admin/datasets)
   → Filters uploads by criteria → populates dataset_uploads
   Admin logs transaction (POST /admin/transactions)
   → BullMQ: royalty-distribution job queued

5. ROYALTY DISTRIBUTION
   Worker picks up job
   → Splits royalty_pool equally across uploads in dataset
   → For each upload:
     - Creates royalty_event
     - Credits contributor wallet
     - Creates wallet_transaction
     - Sends notification
     - Queues referral-royalty job

6. REFERRAL CUT
   Worker picks up job
   → If contributor has a referrer:
     - 10% of royalty → referrer wallet
     - referral_earnings record created
```

## Mobile Navigation Map

```
App.jsx
├── AuthNavigator (Stack)
│   ├── Welcome ──→ Signup ──→ Verify ──→ Profile ──→ Tutorial
│   └── Login (accessible from Welcome)
│
└── AppNavigator (Stack wrapping Tabs)
    ├── Bottom Tabs
    │   ├── Home      → HomeScreen (earnings, tasks, royalties)
    │   ├── Tasks     → TasksScreen (search, filter, browse)
    │   ├── Capture   → CaptureScreen (camera, picker) [FAB]
    │   ├── Earn      → RoyaltiesScreen (royalty events)
    │   └── Wallet    → WalletScreen (balance, withdraw)
    │
    └── Stack Screens (pushed over tabs)
        ├── TaskDetail      → TaskDetailScreen
        ├── AssetDetail     → AssetDetailScreen (⚠️ MOCK DATA)
        ├── UploadMetadata  → UploadMetadataScreen
        ├── ProfileScreen   → ProfileScreen
        ├── Notifications   → NotificationsScreen
        ├── Leaderboard     → LeaderboardScreen
        └── Settings        → SettingsScreen
```

## External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Railway | Backend hosting | DEPLOYED |
| PostgreSQL (Railway) | Primary database | ACTIVE |
| Redis (Railway) | Job queues + cache | ACTIVE |
| Cloudflare R2 | Media file storage | CONFIGURED (fallback stub if missing) |
| Resend | Email OTP delivery | ACTIVE (email only) |
| Expo | Mobile build + push tokens | SDK CONFIGURED, push not sending |

## Known Gaps (as of current state)

See `plans/mvp-plan.md` for prioritized fix list. Key issues:

1. **No real quality scoring** — random number generator, not AI
2. **No real payout processing** — stub worker, no Stripe/PayPal
3. **No push notifications** — token saved but never sent
4. **No admin frontend** — 7 API route groups, zero UI
5. **No audio recording** — camera only, no expo-av
6. **AssetDetailScreen** — only screen still on mock data
7. **R2 upload bug** — sends `{ uri }` object instead of blob
8. **No SMS OTP** — phone OTP logged to console only
