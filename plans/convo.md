
Quirk is a data platform where anyone with a smartphone earns money by capturing the photos, videos, and audio that AI companies need to train their models.
The way it works is simple. You open the app, browse available tasks, and capture what's requested using your phone camera or microphone. It takes minutes. Every accepted submission pays you immediately. But here's what makes Quirk different — your data doesn't just earn once. Every time it gets licensed to a new buyer, you earn again. And again. Your uploads become a growing portfolio of assets that generate income over time, not a one-time transaction that disappears.
The platform shows you exactly which companies use your data, how much you've earned on each piece, and what types of data are in highest demand right now — so you always know what to capture next to maximize your earnings. The more you contribute, the more your portfolio is worth, and the more you earn without doing anything new.
For AI companies, Quirk solves the hardest problem in model training: getting diverse, high-quality, real-world data that's actually licensed. Every data point on the platform comes from a verified contributor who consented and was compensated, with a full provenance chain for regulatory compliance. Need something specific? Tell us — our contributor network captures it on demand. Custom collections across any environment, any geography, any language. Structured, labeled, and ready for your pipeline.

4. PRODUCT ARCHITECTURE — WHAT YOU'RE BUILDING
Three products, not one:
Product 1: Contributor App (Mobile — iOS + Android)
This is the consumer-facing product. It needs to feel like a simple earning app, not a data platform. The contributor should never think about AI training — they should think about completing tasks and watching their wallet grow.
Screens:
Onboarding: Phone number or email signup. No friction. Name, location (important for data tagging — geographic metadata is valuable), and a quick tutorial showing how earning works. Three screens max before they're in the app. Skip the lengthy onboarding — get them to their first task in under 60 seconds.
Task Feed: This is the home screen. A scrollable list of available tasks, sorted by relevance (location, time of day, what they've done before). Each task card shows: what's needed (photo/video/audio), brief description ("Take a photo of your kitchen counter with at least 3 items visible"), estimated time, upfront payout amount, and a difficulty/value indicator. Tasks should feel achievable — nothing that takes more than 2-5 minutes. The psychology is: open app, see easy money, do it, get paid, come back tomorrow.
Capture Screen: When they tap a task, the camera opens with specific guidelines overlaid. For photos: framing guides, minimum resolution requirements, lighting tips. For video: duration targets, what to capture, stability reminders. For audio: prompt text to read aloud or topic to speak about, noise level indicator. The capture screen does real-time quality checks — blur detection, lighting assessment, audio level monitoring. Reject bad captures before they waste everyone's time.
Upload + Auto-tagging: After capture, the app auto-generates metadata: GPS coordinates, timestamp, device info, ambient light level, detected objects (basic on-device ML), detected language (for audio). The contributor can add optional tags. Then they hit submit. Upload happens in background — they can keep doing other tasks while previous ones upload.
Portfolio / Wallet: This is the retention engine. Two sections: Earnings (total earned, pending, available to cash out) and Portfolio (every piece of data they've contributed, with a status for each — "accepted," "in dataset," "licensed to 2 buyers," "earned $0.47 total"). They can see their royalty events in real time. When a buyer purchases a dataset containing their data, they get a notification: "Your kitchen photo from March 3 was just licensed. You earned $0.03." The amounts are small but the psychological effect is massive — their old uploads are making money while they sleep.
Demand Signals: A section showing what's hot right now. "Video of hand movements: HIGH DEMAND — 3x normal rate." "Photos of retail shelves: MEDIUM DEMAND." "Audio in Hindi: VERY HIGH DEMAND — 5x rate." This tells contributors what to produce more of, which solves your quality and relevance problem without you having to manage it manually. The market signal does the work.
Cashout: Support multiple payment methods depending on geography. PayPal, bank transfer, and mobile money (M-Pesa, bKash, etc.) for different markets. Minimum cashout threshold to prevent micro-transaction costs from eating margins — something like $5 or $10 minimum.
Referral: Built-in referral system. "Invite a friend, earn 10% of their first month's earnings." This is your organic growth loop. Contributors who earn money tell friends. Friends sign up. The referral bonus compounds the network effect.
Product 2: Admin Panel (Web)
This is your internal tool. Not consumer-facing. It's where you and your team manage everything.
Task Creator: Design and publish tasks. Set payout rates, geographic targeting, quantity limits ("need 10,000 kitchen photos, stop accepting after that"), quality requirements, metadata requirements. Template system so you can quickly duplicate common task types.
Submission Review: Queue of incoming submissions. AI-assisted quality scoring (blur, relevance, metadata completeness) with human review for edge cases. Approve, reject, or flag for manual review. Bulk actions — you can't manually review every photo when you have 100K contributors.
Contributor Management: View contributor profiles, activity history, quality scores, earnings. Flag problematic contributors (spam, low quality, gaming the system). Tier system — contributors with consistent high-quality submissions get access to higher-paying tasks and priority on new tasks.
Dataset Builder: This is where you package data for buyers. Select submissions by criteria (type, location, quality score, metadata), bundle them into datasets, add dataset-level metadata and documentation, generate licensing terms, and prepare for delivery.
Royalty Engine: When a dataset is sold, the system calculates each contributor's share based on how many of their submissions are included, their royalty rate, and the sale price. Distributes earnings to contributor wallets automatically. Tracks all royalty events for transparency (contributors can see them) and compliance (buyers need provenance records).
Analytics: Contributor growth, submission volume, quality trends, geographic distribution, task completion rates, earnings distribution, buyer pipeline, revenue by dataset type.
Product 3: Buyer Flow (Manual for MVP)
No self-serve portal in v1. You sell directly over email, calls, and LinkedIn outreach. When a buyer wants data, you figure out what they need, build the dataset in your admin panel, negotiate price, send an invoice, deliver the data, and log the transaction (which triggers the royalty engine).
What buyers get: a packaged dataset with full documentation — what's included, how it was collected, consent verification, geographic distribution, quality metrics, and licensing terms. They also get a certificate of provenance showing the data was ethically sourced from consenting contributors who are being compensated. This matters increasingly for enterprise compliance.
Eventually (post-MVP) you build a self-serve enterprise dashboard where buyers can browse available data types, filter by criteria, request custom collections, and purchase directly. But that's months away. Manual sales first.

5. TECHNICAL ARCHITECTURE
Keep it simple. You're building with Claude Code, so lean into what ships fast.
Mobile App: React Native. One codebase, both platforms. Use Expo for faster development. Camera access via expo-camera. Background upload via expo-file-system. Push notifications via expo-notifications. On-device ML for basic quality checks (blur detection, object detection) via TensorFlow Lite or CoreML/ML Kit through expo-ml.
Backend: Node.js with Express or Fastify. PostgreSQL for relational data (users, tasks, submissions, transactions, royalties). S3-compatible object storage for media files (AWS S3 or Cloudflare R2 — R2 is cheaper for egress). Redis for caching and job queues.
Key backend services:
Upload pipeline: Contributor submits → file goes to S3 → background job extracts metadata (EXIF, GPS, device info) → runs quality scoring ML model → stores submission record in Postgres → moves to review queue if it passes automated checks, auto-rejects if it doesn't.
Quality scoring: Start basic. Blur detection (OpenCV), resolution check, GPS validity, basic object detection to confirm the photo matches the task description. You can add more sophisticated scoring later. For MVP, automated scoring catches the obvious garbage and everything else gets a quick human review.
Royalty calculation: When you log a dataset sale in the admin panel, the system identifies every submission included in that dataset, calculates each contributor's share (sale price × royalty rate × contributor's share of the dataset), and credits their wallet. This needs to be audit-friendly — every calculation should be logged and traceable.
Payment processing: Stripe for bank transfers and cards. Add mobile money integrations as needed per market. The wallet is just a ledger in your database — "available balance" is the sum of all credited royalties minus all cashouts.
Infrastructure: Start on a single server. Seriously. A decent VPS (DigitalOcean, Hetzner, Railway) handles everything for the first 10-50K contributors. Don't over-architect. The database, API, and background job processor all run on one box. S3 handles the storage scaling. Move to microservices when you actually have scaling problems, not before.
Data delivery to buyers: For MVP, you literally zip up the files with a metadata CSV and send it via secure file transfer (S3 pre-signed URL, Google Drive, whatever). Automated delivery pipelines are a post-MVP problem.

6. MVP SCOPE — WHAT SHIPS FIRST
The MVP is the smallest thing that lets you: (1) get contributors uploading, (2) review and accept submissions, (3) package and sell a dataset, (4) pay contributors including royalties.
In MVP:
Contributor app: signup, task feed, camera capture, upload, wallet with earnings display, cashout (one payment method — pick PayPal or Stripe Connect to start)
Admin panel: task creator, submission review queue with basic auto-scoring, contributor list, manual dataset packaging, transaction logging that triggers royalty distribution
Backend: upload pipeline, quality scoring (basic), royalty engine, payment processing
One payment method for cashout
Push notifications for royalty events ("your data just earned!")
NOT in MVP:
Self-serve buyer dashboard
Referral system (add in month 2)
Demand signals feed (add when you have enough buyer data to show real demand)
Contributor tiers
Social features
Leaderboards
Advanced ML quality pipeline
Multi-currency
Enterprise API for programmatic data access
Timeline with Claude Code: If you're focused and ruthless about scope, the MVP is 3-4 weeks. The app screens are standard patterns. The backend is CRUD plus a file upload pipeline plus a simple royalty calculation. The admin panel is a basic React web app with tables and forms. Don't gold-plate anything. Ship ugly, iterate fast.

Landing page — V0, Bolt, Lovable → deploy on Vercel/Netlify
Backend + database + auth + storage — Supabase or Firebase
Contributor mobile app — Cursor + Expo/React Native, or FlutterFlow for no-code
Admin panel — Retool, Basedash, or Cursor-generated React dashboard on Supabase
Payments/cashout — Stripe Connect, PayPal
Push notifications — OneSignal, Firebase Cloud Messaging, Expo Notifications
SMS verification — Twilio, Supabase Auth (has phone auth built in)
Email transactional — Resend, SendGrid, Loops
File storage / CDN — Supabase Storage, Cloudflare R2, AWS S3
Quality scoring on uploads — Google Vision API, AWS Rekognition, Clarifai
Duplicate detection — Google Vision API, or perceptual hashing library in backend
NSFW / content moderation — Google Cloud SafeSearch, Hive Moderation, AWS Rekognition
Auto-labeling / classification — Google Vision API, OpenAI Vision, Claude Vision
Analytics — Mixpanel, Amplitude, PostHog
Error monitoring — Sentry
Customer support widget — Intercom, Crisp, Chatwoot
Referral system — Viral Loops, ReferralCandy, or just build with invite codes in Supabase
App Store submission — EAS Build (Expo), Fastlane
Legal (ToS, Privacy Policy, Contributor Agreement) — Termly for quick templates, real lawyer for anything serious
Social accounts — Twitter/X, LinkedIn, Instagram, TikTok
Blog / content — Ghost, Hashnode, or MDX on Next.js
Enterprise sales docs — Notion, Gamma, Google Slides
CRM for buyer pipeline — Attio, Folk, or just a Notion board


Potential list of what’s needed


The internal software to clean, label, and send this data is the hardest part technically from what I’ve learned

I need a working mvp, the app + website, what enterprises dashboard would be

Literally what Kled, and luel do, easiest way to not have holes by just emulating them,


And then like for differentiation, competing directly isn’t always a bad thing, so full speed at building basically the same thing and then, a few things I think are:

Distribution / scope differentiation (who and where):
    1    Undiscovered environments — target contributors in places AI has never seen. Rural areas, factory floors, open-air markets, farms, workshops. Your Bangladesh/South Asia network is the starting wedge but the thesis applies globally — anywhere the internet hasn't documented is where the most valuable data lives.
    2    Workers, not scrollers — Kled gets people uploading camera rolls from their couch. You target people who are already doing interesting physical tasks as their job. Barbers, cooks, welders, tailors, farmers, mechanics. Their daily work IS the valuable data. They don't have to go do anything extra — they just capture what they're already doing.
    3    Language-first communities — go after speakers of languages that barely exist in AI training data. Bangla, Yoruba, Tamil, Swahili, Tagalog dialects. Voice and audio from these communities is genuinely scarce and getting more valuable every month as every AI company tries to go multilingual. Kled has no strategy for this.

Product differentiation (what's different in the app):
    1    Royalty portfolio — one feature, not a whole new product. Every upload earns again when relicensed. Contributors see a portfolio growing over time. Creates switching cost Kled can't match without rebuilding their entire payment model.
    2    Live bounty board — instead of "upload whatever," show exactly what buyers are paying premium for right now. "Kitchen video in South Asia — 5x rate." "Audio in Bangla — 10x rate." Contributors earn way more because they're producing what's actually demanded, not random content. Kled has no demand signal — everything pays the same.
    3    Capture missions — instead of solo uploads, drop a time-limited mission to a geographic area. "We need 500 photos of street food stalls in Dhaka by Friday — $2 per photo." Creates urgency, community, and gets you dense coverage of specific environments fast. Like a bounty hunt. Kled has nothing like this.

But the entire product - I need a working mvp, the app + website, what enterprises dashboard would be, so that the core sales cycle, so enterprise asks, user uploads, it get’s cleaned, label, etc etc, and then given to enterprise, to be very very soon, because today, I’m gonna try and talk to all these people as fast as I can

Enterprise buyers (AI companies who pay for data)
    •    Robotics companies — Figure, Tesla Optimus, 1X, Apptronik, Boston Dynamics, Physical Intelligence
    •    AI labs — OpenAI, Google DeepMind, Meta FAIR, Anthropic, Mistral, Cohere
    •    Video/image model companies — Runway, Stability AI, Midjourney
    •    Vertical AI startups — hundreds of these, easiest to close first
    •    Enterprise companies building internal models — retail, automotive, healthcare, manufacturing
    •    Data resellers/distributors — companies that buy data and resell to labs
Content supply partnerships (bulk data you license, not contributor uploads)
    •    Film studios and production houses (Kled's playbook)
    •    Stock footage libraries
    •    Drone footage companies
    •    University research datasets
    •    News organizations with video archives
Contributors (supply side)
    •    Your Bangladesh network — factory workers, farmers, household workers
    •    South Asian diaspora communities globally
    •    University campuses — campus ambassadors at 5-10 schools
    •    Gig worker communities
    •    Language-specific communities for voice data
    •    Microfinance networks (Grameen, BRAC) — later stage partnership
    •    Mobile money user bases (bKash, M-Pesa) — later stage partnership
UGC creators (growth engine)
    •    20-30 micro-creators making "I earn money on Quirk" content
    •    Find on Billo, Insense, Fiverr, TikTok Creator Marketplace
    •    Target people already making "side hustle" / "money app" / "passive income" content
    •    One big creator if you can get one (MrBeast cost Kled $25K)
Paid acquisition people
    •    Freelance Meta ads media buyer
    •    Freelance TikTok ads media buyer
    •    Landing page designer for ad-specific pages (Dribbble, Contra, Upwork)
    •    Creative editor who can cut UGC into ad variants fast
Growth / marketing hires
    •    One growth marketer who owns the full funnel (Demand Curve community, Reforge alumni, Twitter/X)
    •    Email/SMS marketer — Klaviyo or Loops specialist (Upwork, Contra)
    •    Community manager for contributor Discord/Telegram — can be a power user you promote
Angels / investors
    •    AI-focused angels
    •    Data infrastructure investors
    •    Marketplace investors (people who've built two-sided platforms)
    •    Residency cohort mentors and network
    •    Your existing Quirk Labs investor conversations — update every one of them
    •    Sam Altman-adjacent network through Residency
    •    Seed funds — YC, Hustle Fund, Precursor, Chapter One, Soma Capital, Contrary
Research / credibility
    •    One advisor from a top CS/AI program (doesn't need to be full-time, just name on the site)
    •    One published case study showing buyer got better model performance from your data
    •    Cornell connections for research credibility
Legal
    •    Startup lawyer for ToS, Privacy Policy, Contributor License Agreement
    •    Find through YC lawyer list or Residency recommendations

DEMO SPECIFICS:
Full product demo, just UI and UX, no backend or integrations. Contributor app with home dashboard showing earnings and royalty chart, task board with active bounties, capture screen, royalty feed showing per-usage payments from AI companies, wallet with balance and cashout history. Enterprise dashboard where AI companies can browse available datasets by category, see sample counts and pricing, preview data quality, and request or purchase data. Landing page website with hero, what Quirk does, how it works, app screenshots, and CTA. Everything hardcoded with realistic dummy data. Whatever looks real and tappable in the time you have, skip anything that isn't visible to someone clicking through it.
Literally Kled’s website, and app, whatever isn’t complex to set up
