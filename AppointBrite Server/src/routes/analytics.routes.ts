import { Router } from 'express';
import { getDashboardAnalytics, getDashboardOverview } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/overview/:businessId', authenticate, authorize('BUSINESS_OWNER', 'SUPER_ADMIN', 'STAFF'), getDashboardOverview);
router.get('/:businessId', authenticate, authorize('BUSINESS_OWNER', 'SUPER_ADMIN'), getDashboardAnalytics);

export default router;
