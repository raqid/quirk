import 'dotenv/config';
import app from './app.js';

// Import workers to register them
import './jobs/processUpload.js';
import './jobs/distributeRoyalties.js';
import './jobs/referralRoyalty.js';
import './jobs/processPayout.js';
import weeklySummaryWorker, { scheduleWeeklySummary } from './jobs/weeklySummary.js';
import { weeklySummaryQueue } from './config/queues.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await scheduleWeeklySummary(weeklySummaryQueue);
    console.log('Weekly summary job scheduled');
  } catch (err) {
    console.warn('Could not schedule weekly summary (Redis may be unavailable):', err.message);
  }
});
