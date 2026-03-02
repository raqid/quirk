# MVP Plan — Ship a Working Demo

**Goal**: A fully tappable contributor app + landing page website + enterprise dashboard mockup, all backed by a working API that handles the core loop: sign up → browse tasks → capture → upload → earn → withdraw.

**Timeline**: Aggressive. This is about getting something real in front of people and enterprise prospects ASAP.

---

## Current State

The backend is ~85% functional. The mobile app is ~75% functional. The critical gaps are bugs that break core flows, missing screens/features that block the demo, and zero web presence.

## Phase 1: Fix What's Broken (Core Loop)

These bugs block the fundamental contributor flow from working end-to-end.

- [ ] **Fix R2 upload** — `uploadToR2` in `services/api.js` sends `{ uri: fileUri }` object instead of actual file data. Must use `fetch(uri)` → blob, or FormData, or XHR with proper RN file handling
- [ ] **Fix AssetDetailScreen** — wire to real `fetchUpload` API instead of mock data. Remove mock data import
- [ ] **Fix ProfileScreen field mismatch** — `referrals.referred_count` → `referrals.total_referred`, `referrals.total_referral_earnings` → `referrals.total_earned`
- [ ] **Fix TaskDetailScreen** — use `task.user_submission_count` from API instead of hardcoded `0 approved`
- [ ] **Fix streak_days** — either write to the column on upload-complete, or remove the column and keep the dynamic computation in profile.js (currently both exist, neither writes)

## Phase 2: Complete the Contributor App

Features needed for a convincing demo that aren't purely cosmetic.

- [ ] **Audio recording** — add `expo-av` for audio capture in CaptureScreen. Currently audio type navigates to metadata without recording anything
- [ ] **Demand signals** — add a "Hot Right Now" section to HomeScreen or Tasks showing high-demand data types with multiplied rates (data exists in tasks via `is_hot` flag, just needs UI emphasis)
- [ ] **Referral sharing** — ProfileScreen has the referral code but no share sheet. Add `Share` from react-native to share referral link
- [ ] **Pull-to-refresh** — add RefreshControl to HomeScreen, TasksScreen, WalletScreen, RoyaltiesScreen
- [ ] **Loading skeletons** — replace empty states during initial load with skeleton placeholders on key screens (Home, Tasks, Wallet)
- [ ] **Error states** — add retry UI when API calls fail (currently shows nothing or crashes)

## Phase 3: Landing Page Website

A marketing website that looks real. Can be standalone Next.js/Vite deployed on Vercel.

- [ ] **Hero section** — headline, subhead, app store badges (placeholder), hero image/phone mockup
- [ ] **How it works** — 3-step: Browse tasks → Capture data → Earn money
- [ ] **For contributors** — earnings potential, royalty portfolio concept, payment methods
- [ ] **For AI companies** — data quality, diversity, ethical sourcing, compliance
- [ ] **Social proof** — stats (contributors, uploads, companies), testimonials (can be placeholder)
- [ ] **CTA** — email capture / waitlist, or direct to app store links
- [ ] **Footer** — links, legal (ToS, Privacy), social accounts

## Phase 4: Enterprise Dashboard (Demo/Mockup)

This doesn't need a working backend. It needs to look real when you screen-share with prospects. Can be a static React app with hardcoded data, or even a Figma prototype.

- [ ] **Dataset catalog** — browse available datasets by category (photo, video, audio), see sample counts, quality metrics, geographic distribution
- [ ] **Dataset detail** — preview samples, metadata breakdown, pricing, licensing terms
- [ ] **Request custom collection** — form: data type, quantity, geographic requirements, timeline, budget
- [ ] **Purchase flow** — cart/checkout mockup showing dataset → invoice → download
- [ ] **Dashboard overview** — purchased datasets, usage stats, upcoming deliveries

## Phase 5: Polish for Demo Day

- [ ] **Onboarding stats** — replace hardcoded "2,400+ Contributors" with real or realistic numbers
- [ ] **Seed realistic demo data** — migration or script that populates the DB with convincing sample data (diverse users, uploads with thumbnails, transactions, royalty events)
- [ ] **App icon + splash screen** — branded Expo splash and icon
- [ ] **Push notification permissions** — request on onboarding, save token (endpoint exists)
- [ ] **Notification badge** — show unread count on tab bar or header

---

## Out of Scope for MVP

These are important but not for the first shippable demo:

- Real payment processing (Stripe Connect, PayPal) — payout worker stays as stub
- Real quality scoring AI — random score is fine for demo
- Phone SMS OTP — email OTP works, phone stays console.log
- Admin panel frontend — use API directly or Retool for now
- Password reset flow
- Multi-currency support
- App Store submission (EAS Build)
- Analytics (Mixpanel, PostHog)
- Content moderation / NSFW detection

---

## Success Criteria

The MVP is done when:
1. A new user can sign up, verify OTP, complete profile, see tasks, capture a photo, upload it, and see it in their portfolio
2. An admin can approve the upload via API, and the user sees the payment in their wallet
3. The landing page tells a compelling story and captures leads
4. The enterprise dashboard mockup is convincing enough for a sales call screen-share
5. The whole thing doesn't crash
