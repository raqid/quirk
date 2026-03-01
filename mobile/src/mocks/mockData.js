// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const hoursAgo = (n) => new Date(Date.now() - n * 3600000).toISOString();
const minsAgo = (n) => new Date(Date.now() - n * 60000).toISOString();

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export const mockUser = {
  id: 'u1',
  display_name: 'Amara Okafor',
  email: 'amara@test.com',
  country: 'Nigeria',
  city: 'Lagos',
  level: 'silver',
  referral_code: 'AMARA2026',
  member_since: '2025-11-15',
  total_uploads: 847,
  profile_photo_url: null,
};

// ─────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────
export const mockPortfolio = {
  total_earned: 847.32,
  royalties_this_month: 23.47,
  royalties_last_month: 20.91,
  trend_percent: 12.2,
  trend_direction: 'up',
  royalty_percent_of_total: 34,
  photos: { count: 612, earned: 534.20, monthly_royalties: 15.30 },
  videos: { count: 89, earned: 201.50, monthly_royalties: 6.42 },
  audio: { count: 146, earned: 111.62, monthly_royalties: 1.75 },
};

// ─────────────────────────────────────────────
// UPLOADS (20)
// ─────────────────────────────────────────────
export const mockUploads = [
  { id: 'up1',  type: 'photo', category: 'Food & Cooking',           description: 'Street food stall with visible prices, Lagos market',   thumbnail_url: 'https://picsum.photos/seed/up1/400/300',  status: 'approved',   created_at: daysAgo(2),   upfront_payment: 0.05, total_royalties: 1.23, usage_count: 41 },
  { id: 'up2',  type: 'photo', category: 'Street & Market',          description: 'Morning commuters at bus stop',                          thumbnail_url: 'https://picsum.photos/seed/up2/400/300',  status: 'approved',   created_at: daysAgo(4),   upfront_payment: 0.05, total_royalties: 0.88, usage_count: 29 },
  { id: 'up3',  type: 'video', category: 'Vehicles & Transport',     description: 'Dashcam footage of morning highway commute',             thumbnail_url: 'https://picsum.photos/seed/up3/400/300',  status: 'approved',   created_at: daysAgo(6),   upfront_payment: 0.15, total_royalties: 2.10, usage_count: 14 },
  { id: 'up4',  type: 'audio', category: 'Speech & Conversation',    description: 'Conversational Bengali, informal dialogue',              thumbnail_url: 'https://picsum.photos/seed/up4/400/300',  status: 'approved',   created_at: daysAgo(8),   upfront_payment: 0.08, total_royalties: 0.54, usage_count: 18 },
  { id: 'up5',  type: 'photo', category: 'Work & Industry',          description: 'Construction crane and workers at building site',        thumbnail_url: 'https://picsum.photos/seed/up5/400/300',  status: 'approved',   created_at: daysAgo(10),  upfront_payment: 0.10, total_royalties: 0.76, usage_count: 25 },
  { id: 'up6',  type: 'photo', category: 'Handwriting & Text',       description: 'Handwritten shopping list on notebook paper',            thumbnail_url: 'https://picsum.photos/seed/up6/400/300',  status: 'approved',   created_at: daysAgo(12),  upfront_payment: 0.03, total_royalties: 0.91, usage_count: 30 },
  { id: 'up7',  type: 'audio', category: 'Music & Sound',            description: 'Ambient Lagos market sounds, afternoon',                 thumbnail_url: 'https://picsum.photos/seed/up7/400/300',  status: 'approved',   created_at: daysAgo(14),  upfront_payment: 0.06, total_royalties: 0.32, usage_count: 11 },
  { id: 'up8',  type: 'video', category: 'Food & Cooking',           description: 'Jollof rice cooking process, indoor kitchen',            thumbnail_url: 'https://picsum.photos/seed/up8/400/300',  status: 'approved',   created_at: daysAgo(16),  upfront_payment: 0.20, total_royalties: 3.45, usage_count: 23 },
  { id: 'up9',  type: 'photo', category: 'Nature & Agriculture',     description: 'Rural farmland during harvest, golden hour',             thumbnail_url: 'https://picsum.photos/seed/up9/400/300',  status: 'approved',   created_at: daysAgo(18),  upfront_payment: 0.07, total_royalties: 0.42, usage_count: 14 },
  { id: 'up10', type: 'photo', category: 'People & Daily Life',      description: 'Children playing in courtyard after school',             thumbnail_url: 'https://picsum.photos/seed/up10/400/300', status: 'approved',   created_at: daysAgo(20),  upfront_payment: 0.05, total_royalties: 1.08, usage_count: 36 },
  { id: 'up11', type: 'photo', category: 'Buildings & Architecture', description: 'Colonial-era building facade, Lagos Island',             thumbnail_url: 'https://picsum.photos/seed/up11/400/300', status: 'approved',   created_at: daysAgo(22),  upfront_payment: 0.05, total_royalties: 0.61, usage_count: 20 },
  { id: 'up12', type: 'audio', category: 'Speech & Conversation',    description: 'Yoruba market negotiation dialogue',                     thumbnail_url: 'https://picsum.photos/seed/up12/400/300', status: 'approved',   created_at: daysAgo(24),  upfront_payment: 0.08, total_royalties: 0.73, usage_count: 24 },
  { id: 'up13', type: 'photo', category: 'Food & Cooking',           description: 'Suya vendor setup, night market',                        thumbnail_url: 'https://picsum.photos/seed/up13/400/300', status: 'approved',   created_at: daysAgo(26),  upfront_payment: 0.05, total_royalties: 1.55, usage_count: 52 },
  { id: 'up14', type: 'video', category: 'Street & Market',          description: 'Busy intersection, motorbike traffic',                   thumbnail_url: 'https://picsum.photos/seed/up14/400/300', status: 'pending',    created_at: daysAgo(1),   upfront_payment: 0.00, total_royalties: 0.00, usage_count: 0 },
  { id: 'up15', type: 'photo', category: 'Handwriting & Text',       description: 'Handwritten invoice from local shop',                    thumbnail_url: 'https://picsum.photos/seed/up15/400/300', status: 'approved',   created_at: daysAgo(28),  upfront_payment: 0.03, total_royalties: 0.44, usage_count: 15 },
  { id: 'up16', type: 'audio', category: 'Music & Sound',            description: 'Street drummer performance, open air',                   thumbnail_url: 'https://picsum.photos/seed/up16/400/300', status: 'approved',   created_at: daysAgo(30),  upfront_payment: 0.06, total_royalties: 0.28, usage_count: 9 },
  { id: 'up17', type: 'photo', category: 'Animals',                  description: 'Goats in pen at livestock market',                       thumbnail_url: 'https://picsum.photos/seed/up17/400/300', status: 'rejected',   created_at: daysAgo(5),   upfront_payment: 0.00, total_royalties: 0.00, usage_count: 0 },
  { id: 'up18', type: 'photo', category: 'Street & Market',          description: 'Fabric vendor arranging textile bolts',                  thumbnail_url: 'https://picsum.photos/seed/up18/400/300', status: 'approved',   created_at: daysAgo(32),  upfront_payment: 0.05, total_royalties: 0.67, usage_count: 22 },
  { id: 'up19', type: 'video', category: 'Work & Industry',          description: 'Welding sparks in open-air workshop',                    thumbnail_url: 'https://picsum.photos/seed/up19/400/300', status: 'processing', created_at: hoursAgo(3),  upfront_payment: 0.00, total_royalties: 0.00, usage_count: 0 },
  { id: 'up20', type: 'photo', category: 'Nature & Agriculture',     description: 'Cassava field during dry season',                        thumbnail_url: 'https://picsum.photos/seed/up20/400/300', status: 'approved',   created_at: daysAgo(35),  upfront_payment: 0.07, total_royalties: 0.38, usage_count: 13 },
];

// ─────────────────────────────────────────────
// TASKS (8)
// ─────────────────────────────────────────────
export const mockTasks = [
  {
    id: 'tk1', title: 'Street Food With Visible Prices',
    description: 'Capture photos of street food stalls where menu prices are clearly readable.',
    requirements: ['Price tags must be visible', 'Daytime only', 'Min 1080p', 'No motion blur'],
    data_type: 'photo', category: 'Food & Cooking', pay_per_submission: 0.05, royalty_rate: 0.03,
    quantity_needed: 5000, quantity_filled: 4210, deadline: daysAgo(-12), difficulty: 'easy', is_hot: true, status: 'active',
  },
  {
    id: 'tk2', title: 'Morning Commute Dashcam Footage',
    description: 'Record 30-60 second dashcam-style video clips of your morning commute.',
    requirements: ['30-60 seconds continuous', 'Moving vehicle perspective', 'No music', 'Daylight only'],
    data_type: 'video', category: 'Vehicles & Transport', pay_per_submission: 0.15, royalty_rate: 0.05,
    quantity_needed: 2000, quantity_filled: 847, deadline: daysAgo(-8), difficulty: 'medium', is_hot: false, status: 'active',
  },
  {
    id: 'tk3', title: 'Conversational Bengali Speech',
    description: 'Record casual conversational Bengali speech between 2+ people.',
    requirements: ['Min 60 seconds', 'Bengali language only', 'Quiet setting', 'No music'],
    data_type: 'audio', category: 'Speech & Conversation', pay_per_submission: 0.08, royalty_rate: 0.04,
    quantity_needed: 1500, quantity_filled: 320, deadline: daysAgo(-25), difficulty: 'medium', is_hot: false, status: 'active',
  },
  {
    id: 'tk4', title: 'Construction Sites and Heavy Machinery',
    description: 'Capture photos of active construction sites and industrial equipment.',
    requirements: ['Active operation only', 'Public vantage point', 'Min 1080p', 'Include workers if possible'],
    data_type: 'photo', category: 'Work & Industry', pay_per_submission: 0.10, royalty_rate: 0.05,
    quantity_needed: 3000, quantity_filled: 410, deadline: daysAgo(-45), difficulty: 'hard', is_hot: false, status: 'active',
  },
  {
    id: 'tk5', title: 'Handwritten Shopping Lists',
    description: 'Take clear photos of handwritten shopping lists on paper.',
    requirements: ['Full list visible', 'Flat paper', 'Good lighting', 'Any language'],
    data_type: 'photo', category: 'Handwriting & Text', pay_per_submission: 0.03, royalty_rate: 0.02,
    quantity_needed: 10000, quantity_filled: 9340, deadline: daysAgo(-2), difficulty: 'easy', is_hot: true, status: 'active',
  },
  {
    id: 'tk6', title: 'Ambient Market Sounds',
    description: 'Record ambient audio in busy outdoor markets and street fairs.',
    requirements: ['Min 90 seconds', 'Outdoor market only', 'No personal conversations', 'Morning or afternoon'],
    data_type: 'audio', category: 'Music & Sound', pay_per_submission: 0.06, royalty_rate: 0.03,
    quantity_needed: 2500, quantity_filled: 1100, deadline: daysAgo(-30), difficulty: 'easy', is_hot: false, status: 'active',
  },
  {
    id: 'tk7', title: 'Indoor Cooking Process Videos',
    description: 'Record a full cooking process from prep to plating.',
    requirements: ['Min 3 minutes single take', 'All steps visible', 'Well-lit kitchen', 'No narration'],
    data_type: 'video', category: 'Food & Cooking', pay_per_submission: 0.20, royalty_rate: 0.06,
    quantity_needed: 800, quantity_filled: 94, deadline: daysAgo(-60), difficulty: 'hard', is_hot: false, status: 'active',
  },
  {
    id: 'tk8', title: 'Rural Agricultural Scenes',
    description: 'Photograph farming activities and crop fields in rural settings.',
    requirements: ['Active farming activity', 'No posed shots', 'Natural light', 'Wide shots preferred'],
    data_type: 'photo', category: 'Nature & Agriculture', pay_per_submission: 0.07, royalty_rate: 0.04,
    quantity_needed: 4000, quantity_filled: 1820, deadline: daysAgo(-20), difficulty: 'medium', is_hot: false, status: 'active',
  },
];

// ─────────────────────────────────────────────
// ROYALTY EVENTS (30)
// ─────────────────────────────────────────────
const uploadRefs = [
  { upload_id: 'up1',  upload_type: 'photo', asset_label: 'Photo #612' },
  { upload_id: 'up2',  upload_type: 'photo', asset_label: 'Photo #611' },
  { upload_id: 'up3',  upload_type: 'video', asset_label: 'Video #89'  },
  { upload_id: 'up4',  upload_type: 'audio', asset_label: 'Audio #146' },
  { upload_id: 'up5',  upload_type: 'photo', asset_label: 'Photo #610' },
  { upload_id: 'up6',  upload_type: 'photo', asset_label: 'Photo #609' },
  { upload_id: 'up8',  upload_type: 'video', asset_label: 'Video #88'  },
  { upload_id: 'up10', upload_type: 'photo', asset_label: 'Photo #608' },
  { upload_id: 'up13', upload_type: 'photo', asset_label: 'Photo #607' },
  { upload_id: 'up12', upload_type: 'audio', asset_label: 'Audio #145' },
];

export const mockRoyaltyEvents = [
  { id: 're1',  company_name: 'NovaMind AI',  ...uploadRefs[0], amount: 0.031, created_at: minsAgo(42)  },
  { id: 're2',  company_name: 'Vertex Labs',  ...uploadRefs[2], amount: 0.047, created_at: hoursAgo(2)  },
  { id: 're3',  company_name: 'DataForge',    ...uploadRefs[1], amount: 0.018, created_at: hoursAgo(5)  },
  { id: 're4',  company_name: 'SynthAI Corp', ...uploadRefs[5], amount: 0.022, created_at: hoursAgo(9)  },
  { id: 're5',  company_name: 'NovaMind AI',  ...uploadRefs[3], amount: 0.011, created_at: hoursAgo(14) },
  { id: 're6',  company_name: 'Vertex Labs',  ...uploadRefs[7], amount: 0.038, created_at: daysAgo(1)   },
  { id: 're7',  company_name: 'DataForge',    ...uploadRefs[4], amount: 0.025, created_at: daysAgo(1)   },
  { id: 're8',  company_name: 'NovaMind AI',  ...uploadRefs[8], amount: 0.043, created_at: daysAgo(1)   },
  { id: 're9',  company_name: 'SynthAI Corp', ...uploadRefs[9], amount: 0.009, created_at: daysAgo(2)   },
  { id: 're10', company_name: 'Vertex Labs',  ...uploadRefs[0], amount: 0.031, created_at: daysAgo(2)   },
  { id: 're11', company_name: 'DataForge',    ...uploadRefs[2], amount: 0.047, created_at: daysAgo(3)   },
  { id: 're12', company_name: 'NovaMind AI',  ...uploadRefs[6], amount: 0.052, created_at: daysAgo(3)   },
  { id: 're13', company_name: 'SynthAI Corp', ...uploadRefs[1], amount: 0.018, created_at: daysAgo(4)   },
  { id: 're14', company_name: 'Vertex Labs',  ...uploadRefs[3], amount: 0.011, created_at: daysAgo(4)   },
  { id: 're15', company_name: 'DataForge',    ...uploadRefs[5], amount: 0.022, created_at: daysAgo(5)   },
  { id: 're16', company_name: 'NovaMind AI',  ...uploadRefs[7], amount: 0.038, created_at: daysAgo(6)   },
  { id: 're17', company_name: 'SynthAI Corp', ...uploadRefs[4], amount: 0.025, created_at: daysAgo(7)   },
  { id: 're18', company_name: 'Vertex Labs',  ...uploadRefs[8], amount: 0.043, created_at: daysAgo(8)   },
  { id: 're19', company_name: 'DataForge',    ...uploadRefs[9], amount: 0.009, created_at: daysAgo(9)   },
  { id: 're20', company_name: 'NovaMind AI',  ...uploadRefs[0], amount: 0.031, created_at: daysAgo(10)  },
  { id: 're21', company_name: 'SynthAI Corp', ...uploadRefs[2], amount: 0.047, created_at: daysAgo(12)  },
  { id: 're22', company_name: 'Vertex Labs',  ...uploadRefs[6], amount: 0.052, created_at: daysAgo(14)  },
  { id: 're23', company_name: 'DataForge',    ...uploadRefs[1], amount: 0.018, created_at: daysAgo(15)  },
  { id: 're24', company_name: 'NovaMind AI',  ...uploadRefs[3], amount: 0.011, created_at: daysAgo(17)  },
  { id: 're25', company_name: 'SynthAI Corp', ...uploadRefs[5], amount: 0.022, created_at: daysAgo(18)  },
  { id: 're26', company_name: 'Vertex Labs',  ...uploadRefs[7], amount: 0.038, created_at: daysAgo(20)  },
  { id: 're27', company_name: 'DataForge',    ...uploadRefs[4], amount: 0.025, created_at: daysAgo(22)  },
  { id: 're28', company_name: 'NovaMind AI',  ...uploadRefs[8], amount: 0.043, created_at: daysAgo(24)  },
  { id: 're29', company_name: 'SynthAI Corp', ...uploadRefs[9], amount: 0.009, created_at: daysAgo(26)  },
  { id: 're30', company_name: 'Vertex Labs',  ...uploadRefs[0], amount: 0.031, created_at: daysAgo(29)  },
];

// ─────────────────────────────────────────────
// ROYALTY SUMMARY
// ─────────────────────────────────────────────
export const mockRoyaltySummary = {
  this_month: 23.47,
  companies_count: 4,
  total_uses: 847,
  by_month: [
    { month: 'Sep 2025', amount: 8.12  },
    { month: 'Oct 2025', amount: 11.44 },
    { month: 'Nov 2025', amount: 14.20 },
    { month: 'Dec 2025', amount: 17.85 },
    { month: 'Jan 2026', amount: 20.91 },
    { month: 'Feb 2026', amount: 23.47 },
  ],
};

// ─────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────
export const mockWallet = {
  available_balance: 42.18,
  pending_balance: 3.22,
  total_earned: 847.32,
  total_royalties: 288.09,
  total_withdrawn: 805.14,
  payout_method: { type: 'paypal', details: { email: 'amara***@gmail.com' } },
};

// ─────────────────────────────────────────────
// TRANSACTIONS (25)
// ─────────────────────────────────────────────
export const mockTransactions = [
  { id: 'tx1',  type: 'royalty',         description: 'Royalty — NovaMind AI used Photo #612',       amount:   0.031, created_at: minsAgo(42)   },
  { id: 'tx2',  type: 'royalty',         description: 'Royalty — Vertex Labs used Video #89',         amount:   0.047, created_at: hoursAgo(2)   },
  { id: 'tx3',  type: 'upfront_payment', description: 'Upload approved: street food photo',           amount:   0.05,  created_at: daysAgo(1)    },
  { id: 'tx4',  type: 'royalty',         description: 'Royalty — DataForge used Photo #611',           amount:   0.018, created_at: daysAgo(1)    },
  { id: 'tx5',  type: 'royalty',         description: 'Royalty — SynthAI Corp used Photo #609',       amount:   0.022, created_at: daysAgo(2)    },
  { id: 'tx6',  type: 'upfront_payment', description: 'Upload approved: dashcam commute video',       amount:   0.15,  created_at: daysAgo(2)    },
  { id: 'tx7',  type: 'royalty',         description: 'Royalty — NovaMind AI used Audio #146',        amount:   0.011, created_at: daysAgo(3)    },
  { id: 'tx8',  type: 'payout',          description: 'PayPal payout',                                amount:  -50.00, created_at: daysAgo(5)    },
  { id: 'tx9',  type: 'royalty',         description: 'Royalty — Vertex Labs used Photo #612',        amount:   0.031, created_at: daysAgo(5)    },
  { id: 'tx10', type: 'upfront_payment', description: 'Upload approved: handwritten list',            amount:   0.03,  created_at: daysAgo(6)    },
  { id: 'tx11', type: 'royalty',         description: 'Royalty — DataForge used Video #88',           amount:   0.052, created_at: daysAgo(7)    },
  { id: 'tx12', type: 'upfront_payment', description: 'Upload approved: cooking video',               amount:   0.20,  created_at: daysAgo(8)    },
  { id: 'tx13', type: 'royalty',         description: 'Royalty — SynthAI Corp used Photo #610',       amount:   0.025, created_at: daysAgo(9)    },
  { id: 'tx14', type: 'payout',          description: 'PayPal payout',                                amount:  -75.00, created_at: daysAgo(12)   },
  { id: 'tx15', type: 'royalty',         description: 'Royalty — NovaMind AI used Photo #607',        amount:   0.043, created_at: daysAgo(12)   },
  { id: 'tx16', type: 'upfront_payment', description: 'Upload approved: construction site',           amount:   0.10,  created_at: daysAgo(14)   },
  { id: 'tx17', type: 'referral_bonus',  description: 'Referral bonus — Tunde joined Quirk',         amount:   2.50,  created_at: daysAgo(15)   },
  { id: 'tx18', type: 'royalty',         description: 'Royalty — Vertex Labs used Audio #145',        amount:   0.009, created_at: daysAgo(16)   },
  { id: 'tx19', type: 'upfront_payment', description: 'Upload approved: market sounds',               amount:   0.06,  created_at: daysAgo(17)   },
  { id: 'tx20', type: 'payout',          description: 'PayPal payout',                                amount: -100.00, created_at: daysAgo(20)   },
  { id: 'tx21', type: 'royalty',         description: 'Royalty — DataForge used Photo #608',          amount:   0.038, created_at: daysAgo(21)   },
  { id: 'tx22', type: 'upfront_payment', description: 'Upload approved: rural farmland',              amount:   0.07,  created_at: daysAgo(22)   },
  { id: 'tx23', type: 'referral_bonus',  description: 'Referral bonus — Ngozi joined Quirk',         amount:   2.50,  created_at: daysAgo(24)   },
  { id: 'tx24', type: 'royalty',         description: 'Royalty — SynthAI Corp used Video #89',        amount:   0.047, created_at: daysAgo(26)   },
  { id: 'tx25', type: 'payout',          description: 'PayPal payout',                                amount: -200.00, created_at: daysAgo(30)   },
];

// ─────────────────────────────────────────────
// DEMAND SIGNAL
// ─────────────────────────────────────────────
export const mockDemandSignal = {
  category: 'Food & Cooking',
  multiplier: 3.2,
  message: 'Street food photos earning 3.2x average this week',
};

// ─────────────────────────────────────────────
// REFERRALS
// ─────────────────────────────────────────────
export const mockReferrals = {
  referral_code: 'AMARA2026',
  referral_link: 'https://quirk.app/r/AMARA2026',
  total_referred: 7,
  total_signed_up: 5,
  total_earned: 12.84,
  referrals: [
    { display_name: 'Tunde A.',  signup_date: daysAgo(15), earnings_from_them: 4.20 },
    { display_name: 'Ngozi B.',  signup_date: daysAgo(24), earnings_from_them: 3.81 },
    { display_name: 'Emeka C.',  signup_date: daysAgo(38), earnings_from_them: 2.55 },
    { display_name: 'Fatima D.', signup_date: daysAgo(52), earnings_from_them: 1.43 },
    { display_name: 'Chidi E.',  signup_date: daysAgo(60), earnings_from_them: 0.85 },
  ],
};

// ─────────────────────────────────────────────
// NOTIFICATIONS (15)
// ─────────────────────────────────────────────
export const mockNotifications = [
  { id: 'n1',  type: 'royalty_received', title: 'Royalty received',           body: 'NovaMind AI used Photo #612. You earned $0.031.',                                 read: false, created_at: minsAgo(42)  },
  { id: 'n2',  type: 'royalty_received', title: 'Royalty received',           body: 'Vertex Labs used Video #89. You earned $0.047.',                                  read: false, created_at: hoursAgo(2)  },
  { id: 'n3',  type: 'upload_approved',  title: 'Upload approved!',           body: 'Your street food photo was approved. $0.05 added to your wallet.',                read: false, created_at: daysAgo(1)   },
  { id: 'n4',  type: 'royalty_received', title: 'Royalty received',           body: 'DataForge used Photo #611. You earned $0.018.',                                   read: true,  created_at: daysAgo(1)   },
  { id: 'n5',  type: 'new_task',         title: 'New task: high pay',         body: 'Indoor Cooking Process Videos — earn up to $0.20 per video.',                    read: false, created_at: daysAgo(2)   },
  { id: 'n6',  type: 'upload_rejected',  title: 'Upload not accepted',        body: 'Your goat pen photo was rejected: image quality too low.',                       read: true,  created_at: daysAgo(5)   },
  { id: 'n7',  type: 'payout_complete',  title: 'Payout sent!',               body: '$50.00 has been sent to your PayPal.',                                           read: true,  created_at: daysAgo(5)   },
  { id: 'n8',  type: 'referral_signup',  title: 'Friend joined Quirk',        body: "Tunde joined using your referral code.",                                         read: true,  created_at: daysAgo(15)  },
  { id: 'n9',  type: 'weekly_summary',   title: 'Your week in review',        body: 'This week: 12 uploads approved, $3.47 earned, 94 royalty events.',               read: true,  created_at: daysAgo(7)   },
  { id: 'n10', type: 'milestone',        title: 'Milestone: 500 uploads',     body: "You've had 500 uploads approved! Upgraded to Silver level.",                     read: true,  created_at: daysAgo(20)  },
  { id: 'n11', type: 'royalty_received', title: 'Royalty received',           body: 'SynthAI Corp used 3 of your assets. Total: $0.066.',                             read: true,  created_at: daysAgo(9)   },
  { id: 'n12', type: 'payout_complete',  title: 'Payout sent!',               body: '$75.00 has been sent to your PayPal.',                                           read: true,  created_at: daysAgo(12)  },
  { id: 'n13', type: 'new_task',         title: 'Task ending soon',           body: 'Handwritten Shopping Lists task ends in 2 days.',                                read: true,  created_at: daysAgo(8)   },
  { id: 'n14', type: 'referral_signup',  title: 'Friend joined Quirk',        body: 'Ngozi joined using your referral code.',                                        read: true,  created_at: daysAgo(24)  },
  { id: 'n15', type: 'weekly_summary',   title: 'Your week in review',        body: 'This week: 8 uploads approved, $2.91 earned, 67 royalty events.',               read: true,  created_at: daysAgo(14)  },
];
