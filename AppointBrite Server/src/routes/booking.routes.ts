import { Router } from 'express';
import { getAvailability, createBooking, getUserBookings, cancelBooking, rescheduleBooking } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const router = Router();

// Publicly accessible for guest bookings
router.get('/availability/:businessId', getAvailability);

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    } catch (e) {
      // ignore 
    }
  }
  next();
};

router.post('/', optionalAuth, createBooking);

// Protected routes (require login)
router.use(authenticate);
router.get('/', getUserBookings);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/reschedule', rescheduleBooking);

export const bookingRouter = router;
