import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', createReview);

export const reviewRouter = router;
