import { Router } from 'express';
import { searchBusinesses, getBusinessById, getBusinessServices, getBusinessReviews, getBusinessStaff, getMyBusiness, updateMyBusiness, getBusinessCustomers, banCustomer } from '../controllers/business.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { promotionController } from '../controllers/promotion.controller';

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

// Promotions (Business Owner)
router.post('/:businessId/promotions', authenticate, promotionController.createPromotion);
router.get('/:businessId/promotions', authenticate, promotionController.getPromotions);
router.patch('/:businessId/promotions/:promotionId/toggle', authenticate, promotionController.togglePromotion);
router.put('/:businessId/promotions/:promotionId', authenticate, promotionController.updatePromotion);
router.delete('/:businessId/promotions/:promotionId', authenticate, promotionController.deletePromotion);

// Promotions (Public)
router.get('/:businessId/active-promotions', promotionController.getActivePromotions);
router.post('/:businessId/promotions/validate', promotionController.validatePromotion);

export const businessRouter = router;
