import { Router } from 'express';
import { getBusinessStaff, createStaff, updateStaff, deleteStaff } from '../controllers/staff.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get staff for a specific business (public/customer accessible too for booking)
router.get('/business/:businessId', getBusinessStaff);

// All routes below require Business Owner role
router.use(authenticate);
router.use(authorize('BUSINESS_OWNER'));

router.get('/', getBusinessStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
