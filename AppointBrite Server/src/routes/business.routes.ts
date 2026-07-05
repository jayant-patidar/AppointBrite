import { Router } from 'express';
import { searchBusinesses, getBusinessById, getBusinessServices, getBusinessReviews, getBusinessStaff, getMyBusiness, updateMyBusiness, getBusinessCustomers, banCustomer } from '../controllers/business.controller';
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
router.get('/:businessId/customers', authenticate, getBusinessCustomers);
router.post('/:businessId/ban-customer', authenticate, banCustomer);

export const businessRouter = router;
