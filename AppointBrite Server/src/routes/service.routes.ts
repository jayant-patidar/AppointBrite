import { Router } from 'express';
import { getMyServices, createService, updateService, deleteService } from '../controllers/service.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All service management routes require authentication
router.use(authenticate);

router.get('/my-services', getMyServices);
router.post('/', createService);
router.patch('/:id', updateService);
router.delete('/:id', deleteService);

export const serviceRouter = router;
