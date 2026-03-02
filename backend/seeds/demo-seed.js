import { randomUUID } from 'crypto';

// Helper: date N days ago
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function seed(knex) {
  // ── Clear in FK-safe order ──────────────────────────────────────────────────
  await knex('notifications').del();
  await knex('referral_earnings').del();
  await knex('payouts').del();
  await knex('wallet_transactions').del();
  await knex('royalty_events').del();
  await knex('transactions').del();
  await knex('dataset_uploads').del();
  await knex('datasets').del();
  await knex('buyers').del();
  await knex('uploads').del();
  await knex('tasks').del();
  await knex('wallets').del();
  await knex('users').del();

  // ── Users ───────────────────────────────────────────────────────────────────
  const demoUserId = randomUUID();
  const adminUserId = randomUUID();
  const referredUserIds = Array.from({ length: 5 }, () => randomUUID());

  const demoReferralCode = 'AISHA2024';

  await knex('users').insert([
    {
      id: demoUserId,
      email: 'aisha@example.com',
      phone: '+8801712345678',
      password_hash: '$2b$10$demohashedpasswordforaisharahman',
      display_name: 'Aisha Rahman',
      country: 'Bangladesh',
      city: 'Dhaka',
      level: 'gold',
      role: 'user',
      status: 'active',
      referral_code: demoReferralCode,
      member_since: 'January 2024',
      created_at: daysAgo(60),
      updated_at: daysAgo(1),
    },
    {
      id: adminUserId,
      email: 'admin@quirk.ai',
      phone: null,
      password_hash: '$2b$10$demohashedpasswordforadminuser00',
      display_name: 'Quirk Admin',
      country: 'United States',
      city: 'San Francisco',
      level: 'platinum',
      role: 'admin',
      status: 'active',
      referral_code: 'ADMIN0001',
      member_since: 'January 2024',
      created_at: daysAgo(60),
      updated_at: daysAgo(1),
    },
    ...referredUserIds.map((id, i) => ({
      id,
      email: `referred${i + 1}@example.com`,
      phone: null,
      password_hash: '$2b$10$demohashedpasswordforreferreduser',
      display_name: `Referred User ${i + 1}`,
      country: ['Bangladesh', 'India', 'Pakistan', 'Nigeria', 'Indonesia'][i],
      city: ['Chittagong', 'Mumbai', 'Karachi', 'Lagos', 'Jakarta'][i],
      level: 'bronze',
      role: 'user',
      status: 'active',
      referral_code: `REF00${i + 1}`,
      referred_by: demoUserId,
      member_since: 'February 2024',
      created_at: daysAgo(45 - i * 5),
      updated_at: daysAgo(10 - i),
    })),
  ]);

  // ── Wallets ─────────────────────────────────────────────────────────────────
  await knex('wallets').insert([
    {
      id: randomUUID(),
      user_id: demoUserId,
      available_balance: 42.18,
      pending_balance: 12.50,
      total_earned: 127.43,
      total_royalties: 34.21,
      total_withdrawn: 85.00,
      payout_method: 'bkash',
      payout_details: JSON.stringify({ phone: '+8801712345678' }),
      created_at: daysAgo(60),
      updated_at: daysAgo(1),
    },
    {
      id: randomUUID(),
      user_id: adminUserId,
      available_balance: 0,
      pending_balance: 0,
      total_earned: 0,
      total_royalties: 0,
      total_withdrawn: 0,
      created_at: daysAgo(60),
      updated_at: daysAgo(60),
    },
    ...referredUserIds.map((userId, i) => ({
      id: randomUUID(),
      user_id: userId,
      available_balance: (5 + i * 2.5).toFixed(4),
      pending_balance: (1 + i).toFixed(4),
      total_earned: (8 + i * 3).toFixed(4),
      total_royalties: (2 + i).toFixed(4),
      total_withdrawn: 0,
      created_at: daysAgo(45 - i * 5),
      updated_at: daysAgo(5),
    })),
  ]);

  // ── Tasks ───────────────────────────────────────────────────────────────────
  const taskIds = Array.from({ length: 12 }, () => randomUUID());

  await knex('tasks').insert([
    {
      id: taskIds[0],
      title: 'Street Food Photography — South Asia',
      description: 'Capture authentic street food vendors and their stalls in natural daylight. Show the food, the vendor, and the surrounding environment.',
      requirements: JSON.stringify(['Natural lighting preferred', 'Show vendor and food together', 'Min 1080p resolution', 'No filters']),
      data_type: 'photo',
      category: 'food',
      pay_per_submission: 0.75,
      royalty_rate: 0.05,
      quantity_needed: 500,
      quantity_filled: 347,
      quantity_pending: 18,
      deadline: daysAgo(-30),
      difficulty: 'easy',
      is_hot: true,
      auto_approve: false,
      min_quality_score: 70,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(55),
      updated_at: daysAgo(2),
    },
    {
      id: taskIds[1],
      title: 'Bangla Voice Commands — Smart Home',
      description: 'Record yourself saying smart home commands in Bangla (Bengali). Speak naturally as if controlling your home.',
      requirements: JSON.stringify(['Quiet room', 'Clear pronunciation', 'Each command 3–5 seconds', 'Min 44.1kHz audio']),
      data_type: 'audio',
      category: 'voice',
      pay_per_submission: 1.50,
      royalty_rate: 0.08,
      quantity_needed: 200,
      quantity_filled: 112,
      quantity_pending: 7,
      deadline: daysAgo(-45),
      difficulty: 'medium',
      is_hot: true,
      auto_approve: false,
      min_quality_score: 80,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(50),
      updated_at: daysAgo(1),
    },
    {
      id: taskIds[2],
      title: 'Urban Pedestrian Movement — Busy Streets',
      description: 'Short video clips of pedestrians crossing streets, walking through markets, or navigating busy urban areas.',
      requirements: JSON.stringify(['10–30 second clips', 'Steady camera or tripod', 'Diverse crowd preferred', '1080p minimum']),
      data_type: 'video',
      category: 'urban',
      pay_per_submission: 2.00,
      royalty_rate: 0.10,
      quantity_needed: 150,
      quantity_filled: 89,
      quantity_pending: 12,
      deadline: daysAgo(-20),
      difficulty: 'hard',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 75,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(48),
      updated_at: daysAgo(3),
    },
    {
      id: taskIds[3],
      title: 'Hand Gestures — Everyday Actions',
      description: 'Photos of hands performing common daily actions: typing, cooking, handshakes, writing, phone use.',
      requirements: JSON.stringify(['Clear hand visibility', 'Neutral background preferred', 'In-focus shots only']),
      data_type: 'photo',
      category: 'gestures',
      pay_per_submission: 0.50,
      royalty_rate: 0.04,
      quantity_needed: 1000,
      quantity_filled: 634,
      quantity_pending: 42,
      deadline: daysAgo(-60),
      difficulty: 'easy',
      is_hot: false,
      auto_approve: true,
      min_quality_score: 65,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(45),
      updated_at: daysAgo(2),
    },
    {
      id: taskIds[4],
      title: 'Kitchen & Cooking Scenes',
      description: 'Capture home cooking in action — chopping, stirring, plating. Authentic home kitchens preferred.',
      requirements: JSON.stringify(['Show cooking activity', 'Good lighting', 'No branded items in frame']),
      data_type: 'photo',
      category: 'food',
      pay_per_submission: 0.60,
      royalty_rate: 0.05,
      quantity_needed: 300,
      quantity_filled: 201,
      quantity_pending: 15,
      deadline: daysAgo(-15),
      difficulty: 'easy',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 70,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(40),
      updated_at: daysAgo(4),
    },
    {
      id: taskIds[5],
      title: 'Multilingual Storefront Signs',
      description: 'Photograph shopfronts and signs in local languages — particularly South and Southeast Asian scripts.',
      requirements: JSON.stringify(['Show full sign', 'Legible text', 'Include surroundings for context']),
      data_type: 'photo',
      category: 'text',
      pay_per_submission: 0.40,
      royalty_rate: 0.03,
      quantity_needed: 800,
      quantity_filled: 412,
      quantity_pending: 33,
      deadline: daysAgo(-90),
      difficulty: 'easy',
      is_hot: false,
      auto_approve: true,
      min_quality_score: 65,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(38),
      updated_at: daysAgo(5),
    },
    {
      id: taskIds[6],
      title: 'Emotional Expressions — Diverse Faces',
      description: 'Photographs of people showing genuine emotions: joy, surprise, concentration, sadness. Must have model consent.',
      requirements: JSON.stringify(['Signed release form required', 'Natural expressions only', 'Good face visibility', 'Diverse demographics needed']),
      data_type: 'photo',
      category: 'people',
      pay_per_submission: 1.25,
      royalty_rate: 0.07,
      quantity_needed: 250,
      quantity_filled: 78,
      quantity_pending: 9,
      deadline: daysAgo(-25),
      difficulty: 'hard',
      is_hot: true,
      auto_approve: false,
      min_quality_score: 80,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(35),
      updated_at: daysAgo(3),
    },
    {
      id: taskIds[7],
      title: 'Traffic & Road Conditions',
      description: 'Video footage of traffic intersections, road conditions, and driving scenarios in urban and rural settings.',
      requirements: JSON.stringify(['Min 30 second clips', 'No audio needed', 'Dashcam or handheld', '1080p or higher']),
      data_type: 'video',
      category: 'transport',
      pay_per_submission: 1.75,
      royalty_rate: 0.09,
      quantity_needed: 100,
      quantity_filled: 44,
      quantity_pending: 5,
      deadline: daysAgo(-40),
      difficulty: 'medium',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 72,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(32),
      updated_at: daysAgo(6),
    },
    {
      id: taskIds[8],
      title: 'Environmental Sounds — Markets',
      description: 'Ambient audio recordings from local markets, bazaars, and street vendors. Capture the authentic soundscape.',
      requirements: JSON.stringify(['2–5 minute recordings', 'Minimal wind noise', 'Capture crowd ambience', 'Label location type']),
      data_type: 'audio',
      category: 'ambient',
      pay_per_submission: 1.00,
      royalty_rate: 0.06,
      quantity_needed: 180,
      quantity_filled: 95,
      quantity_pending: 8,
      deadline: daysAgo(-35),
      difficulty: 'medium',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 75,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(30),
      updated_at: daysAgo(7),
    },
    {
      id: taskIds[9],
      title: 'Agricultural Scenes — Farming Activities',
      description: 'Document farming life: planting, harvesting, irrigation, livestock care. Rural and semi-urban farms.',
      requirements: JSON.stringify(['Show farming activity', 'Good daylight', 'Include landscape', 'Diverse crops/activities']),
      data_type: 'photo',
      category: 'agriculture',
      pay_per_submission: 0.65,
      royalty_rate: 0.04,
      quantity_needed: 400,
      quantity_filled: 167,
      quantity_pending: 21,
      deadline: daysAgo(-50),
      difficulty: 'medium',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 68,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(28),
      updated_at: daysAgo(8),
    },
    {
      id: taskIds[10],
      title: 'Children Learning & Play',
      description: 'Footage of children in educational settings or at play. Consent required. No identifiable faces without release.',
      requirements: JSON.stringify(['Guardian consent mandatory', 'No identifiable faces without release', 'Show learning or play activity', '15–45 second clips']),
      data_type: 'video',
      category: 'education',
      pay_per_submission: 1.50,
      royalty_rate: 0.08,
      quantity_needed: 120,
      quantity_filled: 31,
      quantity_pending: 4,
      deadline: daysAgo(-28),
      difficulty: 'hard',
      is_hot: false,
      auto_approve: false,
      min_quality_score: 78,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(25),
      updated_at: daysAgo(9),
    },
    {
      id: taskIds[11],
      title: 'Night Market & Low-Light Scenes',
      description: 'Capture vibrant night markets, street stalls, and illuminated urban scenes after dark.',
      requirements: JSON.stringify(['Well-composed low-light shots', 'Show market activity', 'Avoid overexposure from lights']),
      data_type: 'photo',
      category: 'urban',
      pay_per_submission: 0.90,
      royalty_rate: 0.06,
      quantity_needed: 350,
      quantity_filled: 128,
      quantity_pending: 16,
      deadline: daysAgo(-18),
      difficulty: 'medium',
      is_hot: true,
      auto_approve: false,
      min_quality_score: 72,
      example_urls: JSON.stringify([]),
      status: 'active',
      created_at: daysAgo(22),
      updated_at: daysAgo(2),
    },
  ]);

  // ── Uploads ─────────────────────────────────────────────────────────────────
  const uploadIds = Array.from({ length: 32 }, () => randomUUID());

  const uploadsData = [
    // Approved uploads (linked to tasks, mix of types)
    { id: uploadIds[0], task_id: taskIds[0], type: 'photo', category: 'food', status: 'approved', quality_score: 92, upfront_payment: 0.75, total_royalties: 1.82, usage_count: 4, daysAgoN: 55, description: 'Rickshaw puller buying street food from a vendor near Sadarghat' },
    { id: uploadIds[1], task_id: taskIds[0], type: 'photo', category: 'food', status: 'approved', quality_score: 88, upfront_payment: 0.75, total_royalties: 1.44, usage_count: 3, daysAgoN: 52, description: 'Fuchka stall with vibrant colors in Old Dhaka' },
    { id: uploadIds[2], task_id: taskIds[0], type: 'photo', category: 'food', status: 'approved', quality_score: 95, upfront_payment: 0.75, total_royalties: 2.10, usage_count: 5, daysAgoN: 50, description: 'Hilsa fish being grilled at riverside market stall' },
    { id: uploadIds[3], task_id: taskIds[0], type: 'photo', category: 'food', status: 'approved', quality_score: 79, upfront_payment: 0.75, total_royalties: 0.96, usage_count: 2, daysAgoN: 47, description: 'Chai vendor serving customers in clay cups' },
    { id: uploadIds[4], task_id: taskIds[1], type: 'audio', category: 'voice', status: 'approved', quality_score: 91, upfront_payment: 1.50, total_royalties: 2.25, usage_count: 3, daysAgoN: 48, description: 'Bangla voice command: "বাতি বন্ধ করো" (Turn off the lights)' },
    { id: uploadIds[5], task_id: taskIds[1], type: 'audio', category: 'voice', status: 'approved', quality_score: 86, upfront_payment: 1.50, total_royalties: 1.80, usage_count: 2, daysAgoN: 45, description: 'Bangla voice command: "এসি চালু করো" (Turn on the AC)' },
    { id: uploadIds[6], task_id: taskIds[1], type: 'audio', category: 'voice', status: 'approved', quality_score: 93, upfront_payment: 1.50, total_royalties: 2.70, usage_count: 4, daysAgoN: 43, description: 'Bangla voice command: "টিভি বন্ধ করো" (Turn off the TV)' },
    { id: uploadIds[7], task_id: taskIds[2], type: 'video', category: 'urban', status: 'approved', quality_score: 87, upfront_payment: 2.00, total_royalties: 3.10, usage_count: 3, daysAgoN: 42, description: 'Busy intersection at Farmgate with rickshaws and pedestrians' },
    { id: uploadIds[8], task_id: taskIds[2], type: 'video', category: 'urban', status: 'approved', quality_score: 90, upfront_payment: 2.00, total_royalties: 3.60, usage_count: 4, daysAgoN: 40, description: 'Dhaka New Market crowd scene during afternoon rush' },
    { id: uploadIds[9], task_id: taskIds[4], type: 'photo', category: 'food', status: 'approved', quality_score: 82, upfront_payment: 0.60, total_royalties: 0.72, usage_count: 2, daysAgoN: 38, description: 'Dal and roti being prepared on traditional clay stove' },
    { id: uploadIds[10], task_id: taskIds[4], type: 'photo', category: 'food', status: 'approved', quality_score: 76, upfront_payment: 0.60, total_royalties: 0.48, usage_count: 1, daysAgoN: 36, description: 'Hands kneading dough in home kitchen setting' },
    { id: uploadIds[11], task_id: taskIds[3], type: 'photo', category: 'gestures', status: 'approved', quality_score: 84, upfront_payment: 0.50, total_royalties: 0.60, usage_count: 2, daysAgoN: 35, description: 'Hands typing on smartphone keyboard' },
    { id: uploadIds[12], task_id: taskIds[3], type: 'photo', category: 'gestures', status: 'approved', quality_score: 78, upfront_payment: 0.50, total_royalties: 0.30, usage_count: 1, daysAgoN: 33, description: 'Handshake between two people in business setting' },
    { id: uploadIds[13], task_id: taskIds[5], type: 'photo', category: 'text', status: 'approved', quality_score: 73, upfront_payment: 0.40, total_royalties: 0.24, usage_count: 1, daysAgoN: 30, description: 'Bengali script shop sign for pharmacy in Mirpur' },
    { id: uploadIds[14], task_id: taskIds[5], type: 'photo', category: 'text', status: 'approved', quality_score: 80, upfront_payment: 0.40, total_royalties: 0.48, usage_count: 2, daysAgoN: 28, description: 'Mixed Bengali-English restaurant signboard in Gulshan' },
    { id: uploadIds[15], task_id: taskIds[8], type: 'audio', category: 'ambient', status: 'approved', quality_score: 88, upfront_payment: 1.00, total_royalties: 1.50, usage_count: 3, daysAgoN: 27, description: 'Ambient sounds from Karwan Bazar wholesale market' },
    { id: uploadIds[16], task_id: taskIds[9], type: 'photo', category: 'agriculture', status: 'approved', quality_score: 85, upfront_payment: 0.65, total_royalties: 0.78, usage_count: 2, daysAgoN: 25, description: 'Rice paddy harvesting by hand in rural Sylhet' },
    { id: uploadIds[17], task_id: taskIds[11], type: 'photo', category: 'urban', status: 'approved', quality_score: 91, upfront_payment: 0.90, total_royalties: 1.35, usage_count: 3, daysAgoN: 22, description: 'Night market in Bashundhara with colorful neon lights' },
    { id: uploadIds[18], task_id: taskIds[11], type: 'photo', category: 'urban', status: 'approved', quality_score: 94, upfront_payment: 0.90, total_royalties: 1.80, usage_count: 4, daysAgoN: 20, description: 'Street food vendors at illuminated night market, Old Dhaka' },
    { id: uploadIds[19], task_id: taskIds[6], type: 'photo', category: 'people', status: 'approved', quality_score: 89, upfront_payment: 1.25, total_royalties: 2.10, usage_count: 3, daysAgoN: 18, description: 'Genuine laughter expression — woman at family gathering' },
    // Processing uploads
    { id: uploadIds[20], task_id: taskIds[0], type: 'photo', category: 'food', status: 'processing', quality_score: null, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 2, description: 'Biryani vendor with large pot at Puran Dhaka' },
    { id: uploadIds[21], task_id: taskIds[1], type: 'audio', category: 'voice', status: 'processing', quality_score: null, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 1, description: 'Bangla voice command: "দরজা খোলো" (Open the door)' },
    { id: uploadIds[22], task_id: taskIds[7], type: 'video', category: 'transport', status: 'processing', quality_score: null, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 1, description: 'Traffic near Airport road during morning rush' },
    // Pending uploads
    { id: uploadIds[23], task_id: taskIds[2], type: 'video', category: 'urban', status: 'pending', quality_score: 65, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 3, description: 'Shoppers navigating through Bashundhara City mall entrance' },
    { id: uploadIds[24], task_id: taskIds[4], type: 'photo', category: 'food', status: 'pending', quality_score: 71, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 4, description: 'Preparing fish curry in wok over gas stove' },
    { id: uploadIds[25], task_id: taskIds[9], type: 'photo', category: 'agriculture', status: 'pending', quality_score: 68, upfront_payment: 0, total_royalties: 0, usage_count: 0, daysAgoN: 5, description: 'Mustard field in bloom, Jessore district' },
    // Additional approved for variety
    { id: uploadIds[26], task_id: taskIds[3], type: 'photo', category: 'gestures', status: 'approved', quality_score: 81, upfront_payment: 0.50, total_royalties: 0.60, usage_count: 2, daysAgoN: 15, description: 'Writing with pen in notebook, overhead angle' },
    { id: uploadIds[27], task_id: taskIds[5], type: 'photo', category: 'text', status: 'approved', quality_score: 77, upfront_payment: 0.40, total_royalties: 0.24, usage_count: 1, daysAgoN: 12, description: 'Urdu script signboard at clothing store' },
    { id: uploadIds[28], task_id: taskIds[8], type: 'audio', category: 'ambient', status: 'approved', quality_score: 90, upfront_payment: 1.00, total_royalties: 2.00, usage_count: 4, daysAgoN: 10, description: 'Market soundscape with vendors calling out prices in Bangla' },
    { id: uploadIds[29], task_id: taskIds[11], type: 'photo', category: 'urban', status: 'approved', quality_score: 86, upfront_payment: 0.90, total_royalties: 0.90, usage_count: 2, daysAgoN: 8, description: 'Floating market lanterns reflected on canal water' },
    { id: uploadIds[30], task_id: taskIds[0], type: 'photo', category: 'food', status: 'approved', quality_score: 83, upfront_payment: 0.75, total_royalties: 0.96, usage_count: 2, daysAgoN: 6, description: 'Mango and lychee stall at seasonal fruit market' },
    { id: uploadIds[31], task_id: taskIds[6], type: 'photo', category: 'people', status: 'approved', quality_score: 96, upfront_payment: 1.25, total_royalties: 2.80, usage_count: 4, daysAgoN: 4, description: 'Concentrated focus expression — student studying under lamp' },
  ];

  await knex('uploads').insert(
    uploadsData.map(({ daysAgoN, ...u }) => ({
      ...u,
      user_id: demoUserId,
      file_key: `uploads/${demoUserId}/${u.id}.${u.type === 'photo' ? 'jpg' : u.type === 'video' ? 'mp4' : 'wav'}`,
      thumbnail_url: u.type !== 'audio' ? `https://cdn.quirk.ai/thumbnails/${u.id}.jpg` : null,
      language: u.type === 'audio' ? 'bn' : null,
      rejection_reason: null,
      note: null,
      created_at: daysAgo(daysAgoN),
      updated_at: daysAgo(Math.max(0, daysAgoN - 1)),
    }))
  );

  // ── Buyers ──────────────────────────────────────────────────────────────────
  const buyerIds = [randomUUID(), randomUUID(), randomUUID()];

  await knex('buyers').insert([
    {
      id: buyerIds[0],
      company_name: 'OpenAI',
      contact_email: 'data@openai.com',
      api_key: 'oai_demo_key_a1b2c3d4e5f6',
      created_at: daysAgo(50),
      updated_at: daysAgo(10),
    },
    {
      id: buyerIds[1],
      company_name: 'Runway',
      contact_email: 'datasets@runwayml.com',
      api_key: 'rwy_demo_key_g7h8i9j0k1l2',
      created_at: daysAgo(45),
      updated_at: daysAgo(8),
    },
    {
      id: buyerIds[2],
      company_name: 'Stability AI',
      contact_email: 'training@stability.ai',
      api_key: 'stb_demo_key_m3n4o5p6q7r8',
      created_at: daysAgo(40),
      updated_at: daysAgo(5),
    },
  ]);

  // ── Datasets ─────────────────────────────────────────────────────────────────
  const datasetIds = [randomUUID(), randomUUID()];

  await knex('datasets').insert([
    {
      id: datasetIds[0],
      name: 'South Asian Street Scenes',
      description: 'Curated collection of street photography from South Asian urban environments including markets, food vendors, and pedestrian activity.',
      filters: JSON.stringify({ categories: ['food', 'urban', 'gestures', 'text'], region: 'south_asia', data_type: ['photo', 'video'] }),
      upload_count: 45000,
      created_at: daysAgo(30),
      updated_at: daysAgo(3),
    },
    {
      id: datasetIds[1],
      name: 'Multilingual Voice — Bangla',
      description: 'High-quality audio recordings of Bangla (Bengali) speech including commands, conversations, and ambient speech from native speakers.',
      filters: JSON.stringify({ language: 'bn', data_type: ['audio'], category: 'voice' }),
      upload_count: 8000,
      created_at: daysAgo(25),
      updated_at: daysAgo(2),
    },
  ]);

  // ── Dataset Uploads ──────────────────────────────────────────────────────────
  const photoVideoUploadIds = uploadsData
    .filter(u => ['photo', 'video'].includes(u.type) && u.status === 'approved')
    .map(u => u.id);

  const audioUploadIds = uploadsData
    .filter(u => u.type === 'audio' && u.status === 'approved')
    .map(u => u.id);

  await knex('dataset_uploads').insert([
    ...photoVideoUploadIds.map(uploadId => ({
      id: randomUUID(),
      dataset_id: datasetIds[0],
      upload_id: uploadId,
    })),
    ...audioUploadIds.map(uploadId => ({
      id: randomUUID(),
      dataset_id: datasetIds[1],
      upload_id: uploadId,
    })),
  ]);

  // ── Transactions ─────────────────────────────────────────────────────────────
  const transactionIds = [randomUUID(), randomUUID()];

  await knex('transactions').insert([
    {
      id: transactionIds[0],
      buyer_id: buyerIds[0],
      dataset_id: datasetIds[0],
      amount: 12500.00,
      royalty_pool: 3750.00,
      status: 'completed',
      created_at: daysAgo(20),
      updated_at: daysAgo(20),
    },
    {
      id: transactionIds[1],
      buyer_id: buyerIds[1],
      dataset_id: datasetIds[1],
      amount: 4800.00,
      royalty_pool: 1440.00,
      status: 'completed',
      created_at: daysAgo(10),
      updated_at: daysAgo(10),
    },
  ]);

  // ── Royalty Events ───────────────────────────────────────────────────────────
  const approvedPhotoVideoUploads = uploadsData.filter(u =>
    ['photo', 'video'].includes(u.type) && u.status === 'approved'
  );
  const approvedAudioUploads = uploadsData.filter(u =>
    u.type === 'audio' && u.status === 'approved'
  );

  const royaltyEventIds = [];
  const royaltyEventsData = [];

  // Transaction 0 — photo/video uploads → OpenAI
  for (const upload of approvedPhotoVideoUploads) {
    const evId = randomUUID();
    royaltyEventIds.push(evId);
    royaltyEventsData.push({
      id: evId,
      upload_id: upload.id,
      transaction_id: transactionIds[0],
      user_id: demoUserId,
      amount: (Math.random() * 0.08 + 0.01).toFixed(6),
      created_at: daysAgo(20),
      updated_at: daysAgo(20),
    });
  }

  // Transaction 1 — audio uploads → Runway
  for (const upload of approvedAudioUploads) {
    const evId = randomUUID();
    royaltyEventIds.push(evId);
    royaltyEventsData.push({
      id: evId,
      upload_id: upload.id,
      transaction_id: transactionIds[1],
      user_id: demoUserId,
      amount: (Math.random() * 0.12 + 0.02).toFixed(6),
      created_at: daysAgo(10),
      updated_at: daysAgo(10),
    });
  }

  await knex('royalty_events').insert(royaltyEventsData);

  // ── Wallet Transactions ──────────────────────────────────────────────────────
  const walletTxns = [];

  // Upfront payments for approved uploads
  for (const upload of uploadsData.filter(u => u.status === 'approved' && u.upfront_payment > 0)) {
    walletTxns.push({
      id: randomUUID(),
      user_id: demoUserId,
      type: 'upfront_payment',
      amount: upload.upfront_payment,
      description: `Upfront payment for ${upload.type} — ${upload.category}`,
      reference_id: upload.id,
      created_at: daysAgo(upload.daysAgoN),
      updated_at: daysAgo(upload.daysAgoN),
    });
  }

  // Royalty payments from events
  for (const re of royaltyEventsData) {
    const buyerName = re.transaction_id === transactionIds[0] ? 'OpenAI' : 'Runway';
    walletTxns.push({
      id: randomUUID(),
      user_id: demoUserId,
      type: 'royalty',
      amount: re.amount,
      description: `Royalty payment from ${buyerName} dataset license`,
      reference_id: re.id,
      created_at: re.created_at,
      updated_at: re.updated_at,
    });
  }

  // Payout
  walletTxns.push({
    id: randomUUID(),
    user_id: demoUserId,
    type: 'payout',
    amount: 85.00,
    description: 'Withdrawal via bKash — +8801712345678',
    reference_id: null,
    created_at: daysAgo(15),
    updated_at: daysAgo(15),
  });

  // Referral bonuses
  for (let i = 0; i < 5; i++) {
    walletTxns.push({
      id: randomUUID(),
      user_id: demoUserId,
      type: 'referral_bonus',
      amount: (1.5 + i * 0.25).toFixed(4),
      description: `Referral bonus — ${['Referred User 1', 'Referred User 2', 'Referred User 3', 'Referred User 4', 'Referred User 5'][i]} joined`,
      reference_id: referredUserIds[i],
      created_at: daysAgo(45 - i * 5),
      updated_at: daysAgo(45 - i * 5),
    });
  }

  // Streak bonus
  walletTxns.push({
    id: randomUUID(),
    user_id: demoUserId,
    type: 'bonus',
    amount: 5.00,
    description: '30-day upload streak bonus',
    reference_id: null,
    created_at: daysAgo(30),
    updated_at: daysAgo(30),
  });

  await knex('wallet_transactions').insert(walletTxns);

  // ── Payouts ──────────────────────────────────────────────────────────────────
  await knex('payouts').insert([
    {
      id: randomUUID(),
      user_id: demoUserId,
      amount: 85.00,
      status: 'completed',
      external_transaction_id: 'BKS20240215001',
      completed_at: daysAgo(15),
      created_at: daysAgo(16),
      updated_at: daysAgo(15),
    },
  ]);

  // ── Referral Earnings ────────────────────────────────────────────────────────
  const eligibleRoyaltyEvents = royaltyEventsData.slice(0, 5);

  await knex('referral_earnings').insert(
    referredUserIds.map((referredId, i) => ({
      id: randomUUID(),
      referrer_id: demoUserId,
      referred_id: referredId,
      royalty_event_id: eligibleRoyaltyEvents[i].id,
      amount: (parseFloat(eligibleRoyaltyEvents[i].amount) * 0.05).toFixed(6),
      created_at: eligibleRoyaltyEvents[i].created_at,
      updated_at: eligibleRoyaltyEvents[i].updated_at,
    }))
  );

  // ── Notifications ─────────────────────────────────────────────────────────────
  await knex('notifications').insert([
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'royalty',
      title: 'Royalty earned from OpenAI',
      body: 'Your street food photo was licensed by OpenAI — you earned $0.07',
      read: true,
      reference_id: royaltyEventsData[0]?.id ?? null,
      created_at: daysAgo(20),
      updated_at: daysAgo(20),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'royalty',
      title: 'New royalties from Runway',
      body: 'Your Bangla voice recording was licensed by Runway — you earned $0.09',
      read: true,
      reference_id: royaltyEventsData[royaltyEventsData.length - 1]?.id ?? null,
      created_at: daysAgo(10),
      updated_at: daysAgo(10),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'royalty',
      title: 'Royalty payment received',
      body: 'Your kitchen photo was licensed by Runway — you earned $0.03',
      read: false,
      reference_id: null,
      created_at: daysAgo(8),
      updated_at: daysAgo(8),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'approval',
      title: 'Upload approved',
      body: 'Your photo "Hilsa fish being grilled at riverside market stall" has been approved and is now earning royalties.',
      read: true,
      reference_id: uploadIds[2],
      created_at: daysAgo(49),
      updated_at: daysAgo(49),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'approval',
      title: 'Upload approved',
      body: 'Your audio "Bangla voice command: টিভি বন্ধ করো" has been approved.',
      read: true,
      reference_id: uploadIds[6],
      created_at: daysAgo(42),
      updated_at: daysAgo(42),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'approval',
      title: 'Upload approved',
      body: 'Your night market photo has been approved and added to the South Asian Street Scenes dataset.',
      read: false,
      reference_id: uploadIds[17],
      created_at: daysAgo(21),
      updated_at: daysAgo(21),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'task',
      title: 'New task available: Emotional Expressions',
      body: 'A new task matching your profile is live — earn up to $1.25 per approved photo.',
      read: true,
      reference_id: taskIds[6],
      created_at: daysAgo(35),
      updated_at: daysAgo(35),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'task',
      title: 'Hot task: Bangla Voice Commands',
      body: 'This task is filling up fast! Submit your Bangla voice recordings now.',
      read: true,
      reference_id: taskIds[1],
      created_at: daysAgo(47),
      updated_at: daysAgo(47),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'task',
      title: 'Night Market task is trending',
      body: 'The Night Market & Low-Light Scenes task is now marked as Hot. Your recent submissions are eligible.',
      read: false,
      reference_id: taskIds[11],
      created_at: daysAgo(5),
      updated_at: daysAgo(5),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'referral',
      title: 'Referral bonus earned!',
      body: 'Referred User 1 joined Quirk using your link. You earned a $1.50 referral bonus.',
      read: true,
      reference_id: referredUserIds[0],
      created_at: daysAgo(45),
      updated_at: daysAgo(45),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'referral',
      title: 'New referral joined!',
      body: 'Referred User 3 signed up with your code AISHA2024. Keep sharing to earn more!',
      read: true,
      reference_id: referredUserIds[2],
      created_at: daysAgo(35),
      updated_at: daysAgo(35),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'referral',
      title: 'Referral milestone: 5 friends joined!',
      body: 'You have successfully referred 5 contributors to Quirk. Bonus unlocked: $2.00.',
      read: false,
      reference_id: referredUserIds[4],
      created_at: daysAgo(20),
      updated_at: daysAgo(20),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'milestone',
      title: '30-day streak bonus!',
      body: 'Incredible! You have uploaded for 30 days in a row. You earned a $5.00 streak bonus.',
      read: true,
      reference_id: null,
      created_at: daysAgo(30),
      updated_at: daysAgo(30),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'milestone',
      title: 'Gold tier unlocked!',
      body: 'Congratulations! You have reached Gold tier. Enjoy higher royalty rates and priority review.',
      read: true,
      reference_id: null,
      created_at: daysAgo(25),
      updated_at: daysAgo(25),
    },
    {
      id: randomUUID(),
      user_id: demoUserId,
      type: 'milestone',
      title: '200 uploads milestone!',
      body: 'You have submitted 200 approved uploads. Your content is powering AI around the world.',
      read: false,
      reference_id: null,
      created_at: daysAgo(12),
      updated_at: daysAgo(12),
    },
  ]);
}
