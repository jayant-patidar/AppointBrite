import { Router } from 'express';
import { searchBusinesses, getBusinessById, getBusinessServices, getBusinessReviews, getBusinessStaff } from '../controllers/business.controller';

const router = Router();

router.get('/search', searchBusinesses);
router.get('/:id', getBusinessById);
router.get('/:id/services', getBusinessServices);
router.get('/:id/reviews', getBusinessReviews);
router.get('/:id/staff', getBusinessStaff);

export const businessRouter = router;
