# Long-Term Plan: Platform Maturity

**Horizon**: Post-MVP, once the core loop works and you have real contributors and buyer conversations.

This plan covers turning the demo into a real platform that can handle money, scale, and differentiate from Kled/Luel.

---

## Phase A: Real Money (Payments + Payouts)

The payout worker is a stub. This is the first thing that breaks when real users expect real money.

- [ ] **Stripe Connect onboarding** — contributor signs up for Stripe Express account during profile setup or first withdrawal
- [ ] **Payout processing** — replace `processPayout.js` stub with Stripe Transfer API. Handle failures, retries, insufficient funds
- [ ] **Mobile money** — bKash (Bangladesh), M-Pesa (East Africa) integration for target contributor markets. Research aggregators (Paystack, Flutterwave) that handle multiple mobile money providers
- [ ] **Payout dashboard** — admin view of pending/completed/failed payouts with retry capability
- [ ] **Minimum payout threshold** — enforce $5-10 minimum, show progress toward threshold in wallet UI
- [ ] **Tax compliance** — collect W-9/W-8BEN for US contributors, generate 1099s for annual earnings over $600

## Phase B: Quality Pipeline (Replace Random Scoring)

The random quality_score (60-95) needs to become real before buyers trust the data.

- [ ] **Blur detection** — OpenCV or Google Vision API for image sharpness scoring
- [ ] **Resolution + lighting check** — reject uploads below minimum resolution, flag poor lighting
- [ ] **Object detection for task matching** — verify photo actually contains what the task requested (Google Vision, Claude Vision, or AWS Rekognition)
- [ ] **Duplicate detection** — perceptual hashing (pHash) to catch re-uploads of the same image
- [ ] **NSFW / content moderation** — Google SafeSearch or Hive Moderation to auto-reject inappropriate content
- [ ] **Composite quality score** — weighted combination of all signals, configurable per task
- [ ] **Auto-approve threshold** — graduated: new contributors get manual review, consistent high-quality contributors get auto-approved

## Phase C: Contributor Engagement + Retention

The referral system and royalty portfolio are the moat. Make them sticky.

- [ ] **Push notifications (real)** — implement Expo push via `expo-notifications` and `expo-server-sdk`. Send on: upload approved, royalty earned, new hot task, streak at risk, weekly summary
- [ ] **Streak system (real)** — write `streak_days` on upload, send push when streak is at risk of breaking. Show streak prominently on HomeScreen
- [ ] **Contributor tiers (enforced)** — bronze/silver/gold/platinum thresholds based on uploads + quality. Higher tiers unlock: higher-paying tasks, priority task access, lower payout minimums
- [ ] **Capture missions** — time-limited, geo-targeted bounties ("500 photos of street food in Dhaka by Friday, $2/photo"). Admin creates mission via task system with deadline + location constraint
- [ ] **Live bounty board** — real-time demand signals driven by buyer requests. Replace the `is_hot` flag with actual buyer demand data. Show multipliers ("5x rate for kitchen video in South Asia")
- [ ] **Gamification** — weekly challenges, upload milestones, portfolio value badges. Keep it simple — don't build a game, just add achievement moments
- [ ] **SMS OTP** — integrate Twilio or Vonage for phone number verification. Critical for markets where email isn't primary

## Phase D: Enterprise Self-Serve

Move from manual sales to a scalable buyer experience.

- [ ] **Buyer authentication** — API key system exists in DB but has no auth flow. Build login + API key management
- [ ] **Dataset catalog UI** — web dashboard where buyers browse available datasets by type, geography, quality, size
- [ ] **Sample preview** — buyers can view sample data (watermarked/low-res) before purchasing
- [ ] **Custom collection requests** — buyer submits requirements (type, quantity, geography, timeline), system creates a task or mission targeting the right contributors
- [ ] **Self-serve checkout** — Stripe payment for dataset purchase. Triggers royalty distribution automatically
- [ ] **Delivery pipeline** — automated: buyer pays → ZIP with media files + metadata CSV generated → S3 presigned download URL → email notification
- [ ] **Provenance certificates** — per-dataset documentation: contributor consent verification, collection methodology, geographic distribution, licensing terms. PDF generation
- [ ] **API access** — REST API for enterprise buyers to programmatically browse, filter, and purchase datasets. Rate-limited, API-key authenticated

## Phase E: Admin Panel Frontend

7 backend route groups with zero UI. Can't scale operations without this.

- [ ] **Tech choice** — Retool for speed, or custom React dashboard for full control. Retool connects directly to Postgres + API
- [ ] **Submission review queue** — bulk approve/reject with quality scores, preview thumbnails, task context
- [ ] **Task management** — create, edit, set rates, geographic targeting, quantity limits, auto-approve rules
- [ ] **Contributor management** — search, filter, view profiles, quality history, ban/unban
- [ ] **Dataset builder** — visual interface for filtering uploads into datasets, preview before packaging
- [ ] **Transaction + royalty tracking** — log sales, see royalty distributions, audit trail
- [ ] **Analytics dashboard** — contributor growth, upload volume, quality trends, revenue, geographic distribution

## Phase F: Scale + Infrastructure

When you outgrow a single Railway server.

- [ ] **Separate worker processes** — BullMQ workers on dedicated instances, not co-hosted with API
- [ ] **CDN for media delivery** — R2 public URL through Cloudflare CDN for buyer downloads
- [ ] **Database read replicas** — separate read/write for analytics queries vs. transactional writes
- [ ] **Monitoring** — Sentry for errors, Datadog/Grafana for metrics, uptime monitoring
- [ ] **Rate limiting per user** — current global rate limit doesn't prevent a single user from hammering the API
- [ ] **Background job monitoring** — Bull Board or similar for queue health visibility
- [ ] **Automated backups** — database point-in-time recovery, R2 versioning
- [ ] **CI/CD** — GitHub Actions: lint, test, deploy to Railway on merge to main

---

## Priority Order

1. **Phase A** (Real Money) — nothing works without this. Contributors won't stay if they can't withdraw
2. **Phase B** (Quality) — buyers won't pay for random-scored data
3. **Phase C** (Engagement) — retention is the business
4. **Phase E** (Admin) — operational bottleneck without it
5. **Phase D** (Enterprise) — revenue unlock, but manual sales work until this is built
6. **Phase F** (Scale) — only when traffic demands it
