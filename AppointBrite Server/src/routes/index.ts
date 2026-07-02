/**
 * API Router entry point.
 */
import { Router } from 'express';
import { authRouter } from './auth.routes';
import { businessRouter } from './business.routes';
import { bookingRouter } from './booking.routes';
import { reviewRouter } from './review.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
router.use('/businesses', businessRouter);
router.use('/bookings', bookingRouter);
router.use('/reviews', reviewRouter);

export const apiRouter = router;
