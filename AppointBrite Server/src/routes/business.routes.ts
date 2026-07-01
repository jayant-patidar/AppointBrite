import { Router } from 'express';
import { searchBusinesses, getBusinessById, getBusinessServices, getBusinessReviews } from '../controllers/business.controller';

const router = Router();

router.get('/search', searchBusinesses);
router.get('/:id', getBusinessById);
router.get('/:id/services', getBusinessServices);
router.get('/:id/reviews', getBusinessReviews);

export const businessRouter = router;
