# Todo

Active tasks and long-term plans for the Quirk project. Claude Code should reference this file at the start of every session.

## Active Tasks

_No active tasks._

## Demo Sprint — see [demo-plan.md](./demo-plan.md)

### Priority 1 (do first)
- [ ] Fix AssetDetailScreen — wire to real API, remove mock data
- [ ] Fix ProfileScreen referral field mismatch (`referred_count` → `total_referred`, etc.)
- [ ] Fix TaskDetailScreen — use `user_submission_count` from API
- [ ] Fix R2 upload — `uploadToR2` sends `{ uri }` object instead of file blob
- [ ] Demo seed script (`backend/seeds/demo-seed.js`) — realistic users, tasks, uploads, royalties, transactions
- [ ] Landing page website in `web/` — Next.js + Tailwind, dark theme, deploy to Vercel

### Priority 2 (completes the story)
- [ ] Visual polish — earnings chart data, royalty feed with real company names, wallet history, notifications
- [ ] Enterprise dashboard mockup — dataset catalog, detail, request form, purchase history

## Backlog (Post-Demo MVP) — see [mvp-plan.md](./mvp-plan.md)

- [ ] Audio recording (expo-av)
- [ ] Demand signals UI (hot tasks emphasis)
- [ ] Referral share sheet
- [ ] Pull-to-refresh on main screens
- [ ] Loading skeletons + error/retry states
- [ ] App icon + splash screen
- [ ] Push notification permission + badge

## Long-Term Plans

- [ ] **Platform maturity** — payments, quality pipeline, engagement, admin panel, enterprise self-serve, scaling → see [long-term-platform.md](./long-term-platform.md)
- [ ] **Differentiation** — undiscovered environments, worker targeting, language-first, royalty portfolio, capture missions → see [long-term-differentiation.md](./long-term-differentiation.md)

## Completed

_Nothing completed yet._

<!--
Workflow:
1. Move items from Backlog to Active Tasks when starting
2. Check off items as they're done
3. Move checked items to Completed periodically
4. Create new plan files in plans/ for large initiatives
-->
