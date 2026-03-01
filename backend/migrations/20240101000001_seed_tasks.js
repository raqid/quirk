export async function up(knex) {
  const tasks = [
    {
      title: 'Street Food With Visible Prices',
      description: 'Capture photos of street food stalls where menu prices are clearly readable.',
      requirements: JSON.stringify(['Price tags must be visible', 'Daytime only', 'Min 1080p', 'No motion blur']),
      data_type: 'photo', category: 'Food & Cooking',
      pay_per_submission: 0.05, royalty_rate: 0.03,
      quantity_needed: 5000, quantity_filled: 0,
      deadline: new Date(Date.now() + 12 * 86400000),
      difficulty: 'easy', is_hot: true, auto_approve: true, status: 'active',
    },
    {
      title: 'Morning Commute Dashcam Footage',
      description: 'Record 30-60 second dashcam-style video clips of your morning commute.',
      requirements: JSON.stringify(['30-60 seconds continuous', 'Moving vehicle perspective', 'No music', 'Daylight only']),
      data_type: 'video', category: 'Vehicles & Transport',
      pay_per_submission: 0.15, royalty_rate: 0.05,
      quantity_needed: 2000, quantity_filled: 0,
      deadline: new Date(Date.now() + 8 * 86400000),
      difficulty: 'medium', is_hot: false, auto_approve: true, status: 'active',
    },
    {
      title: 'Conversational Speech Recordings',
      description: 'Record casual conversational speech between 2 or more people.',
      requirements: JSON.stringify(['Min 60 seconds', 'Natural conversation', 'Quiet setting', 'No music']),
      data_type: 'audio', category: 'Speech & Conversation',
      pay_per_submission: 0.08, royalty_rate: 0.04,
      quantity_needed: 1500, quantity_filled: 0,
      deadline: new Date(Date.now() + 25 * 86400000),
      difficulty: 'medium', is_hot: false, auto_approve: true, status: 'active',
    },
    {
      title: 'Construction Sites and Heavy Machinery',
      description: 'Capture photos of active construction sites and industrial equipment.',
      requirements: JSON.stringify(['Active operation only', 'Public vantage point', 'Min 1080p', 'Include workers if possible']),
      data_type: 'photo', category: 'Work & Industry',
      pay_per_submission: 0.10, royalty_rate: 0.05,
      quantity_needed: 3000, quantity_filled: 0,
      deadline: new Date(Date.now() + 45 * 86400000),
      difficulty: 'hard', is_hot: false, auto_approve: true, status: 'active',
    },
    {
      title: 'Handwritten Shopping Lists',
      description: 'Take clear photos of handwritten shopping lists on paper.',
      requirements: JSON.stringify(['Full list visible', 'Flat paper', 'Good lighting', 'Any language']),
      data_type: 'photo', category: 'Handwriting & Text',
      pay_per_submission: 0.03, royalty_rate: 0.02,
      quantity_needed: 10000, quantity_filled: 0,
      deadline: new Date(Date.now() + 2 * 86400000),
      difficulty: 'easy', is_hot: true, auto_approve: true, status: 'active',
    },
    {
      title: 'Ambient Market Sounds',
      description: 'Record ambient audio in busy outdoor markets and street fairs.',
      requirements: JSON.stringify(['Min 90 seconds', 'Outdoor market only', 'No personal conversations', 'Morning or afternoon']),
      data_type: 'audio', category: 'Music & Sound',
      pay_per_submission: 0.06, royalty_rate: 0.03,
      quantity_needed: 2500, quantity_filled: 0,
      deadline: new Date(Date.now() + 30 * 86400000),
      difficulty: 'easy', is_hot: false, auto_approve: true, status: 'active',
    },
    {
      title: 'Indoor Cooking Process Videos',
      description: 'Record a full cooking process from prep to plating.',
      requirements: JSON.stringify(['Min 3 minutes single take', 'All steps visible', 'Well-lit kitchen', 'No narration']),
      data_type: 'video', category: 'Food & Cooking',
      pay_per_submission: 0.20, royalty_rate: 0.06,
      quantity_needed: 800, quantity_filled: 0,
      deadline: new Date(Date.now() + 60 * 86400000),
      difficulty: 'hard', is_hot: false, auto_approve: true, status: 'active',
    },
    {
      title: 'Rural Agricultural Scenes',
      description: 'Photograph farming activities and crop fields in rural settings.',
      requirements: JSON.stringify(['Active farming activity', 'No posed shots', 'Natural light', 'Wide shots preferred']),
      data_type: 'photo', category: 'Nature & Agriculture',
      pay_per_submission: 0.07, royalty_rate: 0.04,
      quantity_needed: 4000, quantity_filled: 0,
      deadline: new Date(Date.now() + 20 * 86400000),
      difficulty: 'medium', is_hot: false, auto_approve: true, status: 'active',
    },
  ];

  // Insert only if no tasks exist yet
  const existing = await knex('tasks').count('id as count').first();
  if (Number(existing.count) === 0) {
    await knex('tasks').insert(tasks);
  }
}

export async function down(knex) {
  await knex('tasks').where({ status: 'active' }).delete();
}
