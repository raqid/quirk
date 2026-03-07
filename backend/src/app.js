import express from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import uploadsRoutes from './routes/uploads.js';
import tasksRoutes from './routes/tasks.js';
import walletRoutes from './routes/wallet.js';
import royaltiesRoutes from './routes/royalties.js';
import referralsRoutes from './routes/referrals.js';
import notificationsRoutes from './routes/notifications.js';
import profileRoutes from './routes/profile.js';
import waitlistRoutes from './routes/waitlist.js';

import adminSubmissionsRoutes from './admin-routes/submissions.js';
import adminTasksRoutes from './admin-routes/tasks.js';
import adminContributorsRoutes from './admin-routes/contributors.js';
import adminBuyersRoutes from './admin-routes/buyers.js';
import adminDatasetsRoutes from './admin-routes/datasets.js';
import adminTransactionsRoutes from './admin-routes/transactions.js';
import adminAnalyticsRoutes from './admin-routes/analytics.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/royalties', royaltiesRoutes);
app.use('/api/v1/referrals', referralsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/waitlist', waitlistRoutes);

// Admin API
app.use('/api/v1/admin/submissions', adminSubmissionsRoutes);
app.use('/api/v1/admin/tasks', adminTasksRoutes);
app.use('/api/v1/admin/contributors', adminContributorsRoutes);
app.use('/api/v1/admin/buyers', adminBuyersRoutes);
app.use('/api/v1/admin/datasets', adminDatasetsRoutes);
app.use('/api/v1/admin/transactions', adminTransactionsRoutes);
app.use('/api/v1/admin/analytics', adminAnalyticsRoutes);

app.use(errorHandler);

export default app;
