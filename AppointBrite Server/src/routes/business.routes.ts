import { Router } from 'express';
import { searchBusinesses, getBusinessById, getBusinessServices, getBusinessReviews, getBusinessStaff, getMyBusiness, updateMyBusiness } from '../controllers/business.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/my-business', authenticate, getMyBusiness);
router.patch('/my-business', authenticate, updateMyBusiness);
router.patch('/my-business/onboarding', authenticate, updateMyBusiness); // Legacy route for onboarding wizard

router.get('/search', searchBusinesses);
router.get('/:id', getBusinessById);
router.get('/:id/services', getBusinessServices);
router.get('/:id/reviews', getBusinessReviews);
router.get('/:id/staff', getBusinessStaff);

export const businessRouter = router;
