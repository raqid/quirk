# Demo Plan — Tappable Product Demo

**Goal**: Full product demo that looks real and tappable. Three deliverables: contributor app (polished), enterprise dashboard (mockup), landing page website. Everything hardcoded with realistic dummy data. Skip anything that isn't visible to someone clicking through it.

**Reference**: Kled.ai — dark theme, clean typography, enterprise-grade feel. They use navy/dark backgrounds, Inter font, subtle grays. Our theme is already dark (#0A0A0A bg, #00E676 primary green) — lean into it.

---

## Deliverable 1: Contributor App (Polish Existing)

The app is 75% there. Fix what's broken, polish what's rough, seed convincing data.

### 1A. Fix Broken Screens (blocks demo)

| Screen | Bug | Fix |
|--------|-----|-----|
| AssetDetailScreen | Uses mock data, not real API | Wire to `fetchUpload`, show real royalty events |
| ProfileScreen | `referrals.referred_count` / `referrals.total_referral_earnings` don't match API field names | Use `total_referred` / `total_earned` |
| TaskDetailScreen | "Your submissions" hardcodes `0 approved` | Use `task.user_submission_count` from API |
| UploadMetadataScreen | `uploadToR2` sends `{ uri }` object instead of file blob | Fix to use `fetch(uri)` → blob or RN-compatible FormData |

### 1B. Visual Polish (makes it feel real)

- [ ] **Earnings chart on HomeScreen** — the EarningsBar exists but needs convincing data. Seed 7 days of varied earnings
- [ ] **Royalty feed** — RoyaltiesScreen works but needs seeded events with real-sounding company names ("OpenAI", "Runway", "Figure Robotics", "Stability AI")
- [ ] **Wallet history** — seed transactions showing upfront payments, royalty credits, and a withdrawal
- [ ] **Task board** — seed 8-12 tasks with varied types (photo/video/audio), clear descriptions, realistic pay rates ($0.25-$2.00), fill progress bars at different levels
- [ ] **Portfolio view** — HomeScreen portfolio section needs seeded uploads with status variety (approved, in dataset, earning royalties)
- [ ] **Notification feed** — seed notifications: "Your kitchen photo was licensed by Runway — you earned $0.03", "Task completed — $0.50 credited", "Welcome to Gold tier!"
- [ ] **Capture screen** — works for photos. For demo, don't worry about audio recording. Just make photo capture → metadata → upload feel smooth
- [ ] **Profile** — seed a demo user with Gold tier, 47-day streak, $127.43 total earned, 234 uploads

### 1C. Demo Seed Script

Create `backend/seeds/demo-seed.js` — a single script that populates the DB with:
- 1 demo contributor (Gold tier, active streak, realistic earnings)
- 1 demo admin user
- 12 active tasks across photo/video/audio categories
- 30+ uploads with varied statuses and quality scores
- 3 buyers (realistic AI company names)
- 2 datasets with uploads linked
- 2 transactions that triggered royalty distributions
- 50+ wallet transactions (upfront + royalty + 1 withdrawal)
- 20+ royalty events from different buyers
- 15+ notifications
- 5 referred users with referral earnings

Run with: `cd backend && bun run knex seed:run`

---

## Deliverable 2: Landing Page Website

Build in `web/` — Next.js (App Router) or Vite + React. Deploy to Vercel.

### Tech Choice: Next.js
- App Router for static export (`output: 'export'`)
- Tailwind CSS for rapid styling
- Framer Motion for scroll animations
- Dark theme matching the app (#0A0A0A bg, #00E676 green accents)

### Page Sections (top to bottom)

1. **Navbar** — Logo, "For Contributors", "For AI Companies", "About", CTA button ("Get the App" / "Get Started")

2. **Hero** —
   - Headline: "Your data trains AI. You should get paid."
   - Subhead: "Capture photos, videos, and audio. Earn upfront + royalties every time your data is licensed."
   - CTA: "Download the App" (app store badges, placeholder links)
   - Phone mockup showing HomeScreen with earnings

3. **How It Works** — 3 steps with icons
   - Browse Tasks → Capture Data → Earn Money
   - Each step: icon, title, one-line description

4. **For Contributors** —
   - "Build a portfolio that earns while you sleep"
   - Royalty portfolio concept: every upload earns again when relicensed
   - Earnings potential stats (hardcoded)
   - Payment methods: PayPal, bank transfer, mobile money
   - App screenshots: task feed, capture screen, wallet

5. **For AI Companies** —
   - "Diverse, ethical, real-world training data"
   - Data quality: verified contributors, quality scoring, full provenance
   - Data types: photo, video, audio across geographies and languages
   - Compliance: contributor consent, compensation records, licensing terms
   - CTA: "Request a Dataset" or "Contact Sales"

6. **Stats Bar** — animated counters
   - "10,000+ Contributors" / "2M+ Data Points" / "50+ AI Companies" / "$500K+ Paid Out"
   - (all hardcoded, aspirational)

7. **Testimonials** — 2-3 contributor quotes (can be placeholder/fictional)

8. **CTA Section** —
   - "Start earning today"
   - Email capture / waitlist form (can be static, no backend needed for demo)
   - App store badges

9. **Footer** — Logo, nav links, "Terms", "Privacy", social icons (placeholder), "© 2026 Quirk Labs"

### Design Notes
- Dark background (#0A0A0A or very dark navy like Kled)
- Green accent (#00E676) for CTAs and highlights
- Inter or similar clean sans-serif font
- Generous whitespace, large text, minimal visual clutter
- Phone mockups for app screenshots (use device frame wrappers)
- Subtle scroll animations (fade in, slide up)

---

## Deliverable 3: Enterprise Dashboard (Static Mockup)

Build as a separate route in `web/` (e.g., `/enterprise`) or a standalone page. All hardcoded data, no API calls. Needs to look real on a screen-share with prospects.

### Screens

1. **Dashboard Overview** —
   - Sidebar nav: Overview, Datasets, Collections, Purchases, Settings
   - Summary cards: Available Datasets (24), Total Data Points (2.1M), Active Collections (3), Monthly Spend ($12,400)
   - Recent purchases table
   - Data availability chart by type (photo/video/audio)

2. **Dataset Catalog** —
   - Grid/list of available datasets
   - Each card: name, type (photo/video/audio), sample count, geographic coverage, quality score, price
   - Filter by: type, geography, quality, size, price range
   - Example datasets:
     - "South Asian Street Scenes" — 45K photos, 12 countries, $0.02/image
     - "Multilingual Voice — Bangla" — 8K audio clips, native speakers, $0.15/clip
     - "Kitchen Activities Video" — 12K clips, 30-60s each, $0.50/clip
     - "Industrial Workspace Photos" — 25K photos, factories/workshops, $0.03/image

3. **Dataset Detail** —
   - Metadata breakdown: geographic distribution (map or chart), quality score distribution, device types, collection dates
   - Sample preview: grid of thumbnail images (use stock photos or AI-generated placeholders)
   - Pricing: per-unit and bulk pricing tiers
   - License terms summary
   - CTA: "Purchase Dataset" / "Request Custom Collection"

4. **Request Custom Collection** —
   - Form: data type, quantity needed, geographic requirements, language (for audio), timeline, budget, special instructions
   - CTA: "Submit Request"
   - Note: "Our team will review and respond within 24 hours"

5. **Purchase History** —
   - Table: dataset name, date, quantity, amount, status (delivered/processing), download link
   - Total spend summary

### Design Notes
- Professional SaaS dashboard feel
- Same dark theme but slightly different from contributor app — more grays, less green
- Sidebar navigation
- Tables with clean typography
- Charts: simple bar/donut charts (use recharts or chart.js)

---

## Implementation Order

```
Priority 1 (do first — highest demo impact):
├── 1A. Fix 4 broken screens (2-3 hours)
├── 1C. Demo seed script (2-3 hours)
└── 2.  Landing page (4-6 hours)

Priority 2 (do next — completes the story):
├── 1B. Visual polish on app screens (2-3 hours)
└── 3.  Enterprise dashboard mockup (4-6 hours)
```

Total: ~15-20 hours of focused work.

---

## Out of Scope for Demo

- Real payment processing
- Audio recording
- Push notifications
- Admin panel
- Real quality scoring
- App Store submission
- Backend API changes (beyond seed script)
- Authentication on landing page or enterprise dashboard

## Success Criteria

1. Someone can tap through the contributor app and see: earnings, tasks, capture a photo, wallet balance, royalties from named AI companies, tier progress
2. Landing page tells the Quirk story and looks like a real startup's website
3. Enterprise dashboard can be screen-shared on a sales call and prospects understand what they're buying
4. Nothing crashes, nothing looks broken, all data looks realistic
