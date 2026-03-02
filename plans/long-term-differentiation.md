# Long-Term Plan: Differentiation Strategy

**Horizon**: 3-6 months post-MVP. These are the features that make Quirk not-Kled.

The competitive thesis: Kled gets people uploading camera rolls from their couch. Quirk gets workers, speakers, and communities in places AI has never seen.

---

## Pillar 1: Undiscovered Environments

Target contributors in places AI training data doesn't cover.

- [ ] **Geographic metadata as first-class feature** — every upload tagged with GPS, city, country. Surface this in dataset catalog as a selling point. "Street food data from 47 cities across South Asia"
- [ ] **Location-based task targeting** — tasks appear only for contributors in specific regions. Admin sets geographic bounds when creating tasks
- [ ] **Environment diversity scoring** — track geographic + environmental diversity per dataset. Buyers pay premium for datasets covering rare locations
- [ ] **Offline upload queue** — contributors in low-connectivity areas (rural, factory floors) can capture offline and sync when they have signal. Use expo-file-system + SQLite queue
- [ ] **Lightweight app variant** — strip video/audio for markets with slow connections. Photo-only mode that works on 2G

## Pillar 2: Workers, Not Scrollers

Contributors who are already doing interesting physical tasks.

- [ ] **Occupation-based onboarding** — ask occupation during profile setup. Tag all their uploads with occupation metadata. "Kitchen data from professional cooks" is worth 10x "kitchen photos from random people"
- [ ] **Workplace task templates** — pre-built task types: "Film 30 seconds of your work process", "Photograph your workspace from 3 angles", "Record yourself explaining a task in your language"
- [ ] **Employer/group partnerships** — allow an organization (factory, co-op, school) to onboard their members as a batch. Group admin sees aggregate earnings. Useful for: factories in Bangladesh, farming co-ops, vocational schools
- [ ] **Shift-based capture** — tasks that align with work schedules: "Capture during your morning shift" / "Record end-of-day cleanup". Time-of-day metadata is valuable for temporal diversity

## Pillar 3: Language-First Communities

Voice and audio in languages AI can't access.

- [ ] **Audio recording (real)** — expo-av integration for in-app voice recording with noise level indicator, duration targets, prompt text display
- [ ] **Language verification** — on-device or server-side language detection to verify the audio matches the requested language. Google Speech-to-Text or Whisper API
- [ ] **Script/dialect tagging** — not just "Bangla" but specific dialect region. Granular language metadata increases dataset value
- [ ] **Read-aloud prompts** — tasks that give contributors specific text to read aloud. Useful for TTS training data. Multi-script support (Latin, Arabic, Devanagari, Bengali)
- [ ] **Conversation pair tasks** — two contributors record a conversation on a given topic. Valuable for dialogue model training. Harder to coordinate but high value per unit
- [ ] **Language-specific demand signals** — "Audio in Tamil: 10x rate" prominently displayed. Drive supply toward scarce languages

## Pillar 4: Royalty Portfolio (The Moat)

Every upload earns again when relicensed. This is the switching cost Kled can't match.

- [ ] **Portfolio value display** — HomeScreen shows total portfolio value: sum of all future earning potential based on current licensing rates. "Your portfolio: 847 assets, estimated annual royalties: $XX"
- [ ] **Per-asset lifetime earnings** — AssetDetailScreen shows complete earning history: upfront payment + every royalty event with buyer name and date. "This photo has earned $2.47 across 8 licenses"
- [ ] **Royalty projections** — based on historical licensing rates, project future earnings. "At current rates, your portfolio could earn $X/month"
- [ ] **Portfolio health score** — which uploads are earning vs dormant. "Your top earner: kitchen photo from March 3. Your 12 audio clips have never been licensed — try capturing in-demand languages"
- [ ] **Earnings milestones** — celebrate portfolio milestones: "Your first royalty!", "Portfolio passed $100 lifetime", "$10 earned while you slept"
- [ ] **Data retirement transparency** — when a dataset license expires or a buyer deletes data, notify the contributor and update the portfolio. Full lifecycle visibility

## Pillar 5: Capture Missions

Time-limited, geo-targeted bounties that create urgency and dense data coverage.

- [ ] **Mission system** — extends the task model with: deadline (hard cutoff), geographic bounds (polygon or radius), contributor cap, elevated pay rate, team-based or individual
- [ ] **Mission feed** — separate tab or prominent section on HomeScreen. "Active missions near you" with countdown timer, spots remaining, total bounty
- [ ] **Mission leaderboard** — per-mission contributor ranking. Top contributors get bonus payout
- [ ] **Mission notifications** — push when a new mission drops in your area. "New mission: 500 photos of street food in Dhaka. $2/photo. 3 days left"
- [ ] **Mission history** — completed missions shown as achievements. "You participated in 12 missions. You were #3 in the Dhaka Street Food mission"
- [ ] **Admin mission builder** — create mission with map-based geographic targeting, time window, auto-pay rules, quality thresholds

---

## Implementation Priority

1. **Audio recording** — blocks an entire data type. Immediate.
2. **Royalty portfolio UX** — the differentiator. High visibility, relatively low effort (data already exists).
3. **Occupation-based onboarding + tagging** — one-time profile change, permanent metadata improvement.
4. **Location-based task targeting** — GPS already captured, just needs filtering logic.
5. **Demand signals / bounty board** — drives contributor behavior toward what buyers actually want.
6. **Capture missions** — requires the most new infrastructure, but highest differentiation potential.
7. **Language features** — depends on audio recording being done first.
8. **Offline mode** — important for target markets but complex to build right.
