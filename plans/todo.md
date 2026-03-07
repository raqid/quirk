# Todo

Active tasks and long-term plans for the Quirk project. Claude Code should reference this file at the start of every session.

## Active Tasks

- [x] **Mobile UI overhaul** — monochromatic palette, Outfit font, Lucide icons, shared components (Card, Input, ScreenHeader). All 38 files updated. See plan in `~/.claude/plans/moonlit-moseying-anchor.md`

## MVP Priorities

### P0 — Core bugs (blocking the app)
- [x] Fix AssetDetailScreen — use royalty_events from upload response instead of separate royalties call
- [x] Fix TaskDetailScreen — use `user_submission_count` from task API response
- [ ] Fix R2 upload — verify `uploadToR2` works end-to-end with real R2 credentials on Railway
- [x] Mock payout worker — simulates payment processing with delay, logs MOCK prefix

### P1 — Core loop completeness
- [ ] Verify OTP email delivery works end-to-end (Resend integration)
- [ ] Verify R2 credentials are configured on Railway deployment
- [x] Pull-to-refresh on Tasks, Wallet, Royalties screens
- [x] Error/retry states on all screens (Home, Tasks, Royalties)

### P2 — User expectations
- [x] Loading skeletons for data-fetching screens
- [x] App icon + splash screen
- [x] Push notification sending (backend saves tokens but never sends pushes)
- [x] Audio recording (expo-av installed, real recording flow)

### P3 — Nice to have
- [ ] Referral share sheet (referral system exists, no share UI beyond Profile)
- [ ] Real quality scoring (currently random 60-96, marked MOCK)
- [ ] Admin web panel (admin routes exist, no frontend)
- [ ] Demand signals UI (hot tasks emphasis)

## Mocked APIs (not real money)
- **Payout processing** (`backend/src/jobs/processPayout.js`) — simulates with 2-5s delay, generates `MOCK-PAY-*` transaction IDs
- **Quality scoring** (`backend/src/jobs/processUpload.js`) — random score 60-96, auto-approves above task threshold
- **Royalty distribution** (`backend/src/jobs/distributeRoyalties.js`) — real ledger math but no actual money enters the system
- **Referral royalties** (`backend/src/jobs/referralRoyalty.js`) — 10% referral cut, internal ledger only

## Backlog (Post-MVP)
- [ ] Real payment rails (Stripe Connect, bKash, PayPal, Wise)
- [ ] Real ML quality scoring pipeline
- [ ] Admin web dashboard
- [ ] Enterprise dashboard connected to backend API

## Long-Term Plans

- [ ] **Platform maturity** — payments, quality pipeline, engagement, admin panel, enterprise self-serve, scaling → see [long-term-platform.md](./long-term-platform.md)
- [ ] **Differentiation** — undiscovered environments, worker targeting, language-first, royalty portfolio, capture missions → see [long-term-differentiation.md](./long-term-differentiation.md)

## Completed

- [x] Egocentric/POV task category — seed migration + mobile upload category
- [x] Push notifications — mobile registration, backend sending on upload approval + weekly summary
- [x] Loading skeletons — all 5 data screens (Home, Tasks, Wallet, Royalties, TaskDetail)
- [x] App icon + splash screen — 1024x1024 icon, adaptive icon, 1284x2778 splash
- [x] Infra env var warnings — RESEND_API_KEY, R2_ACCOUNT_ID on backend startup
- [x] Fix AssetDetailScreen — royalty_events from upload response
- [x] Fix TaskDetailScreen — user_submission_count from task API
- [x] Mock payout worker with realistic delay + MOCK prefix logging
- [x] Mark quality scoring as MOCK in code

<!--
Workflow:
1. Move items from Backlog to Active Tasks when starting
2. Check off items as they're done
3. Move checked items to Completed periodically
4. Create new plan files in plans/ for large initiatives
-->
