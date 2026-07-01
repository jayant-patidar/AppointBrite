import { Router } from 'express';
import { getAvailability, createBooking } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Publicly accessible for guest bookings
router.get('/availability/:businessId', getAvailability);

// Allow optional auth for createBooking (authenticate middleware would block if not logged in)
// We need a custom middleware if we want to extract req.user WITHOUT failing if missing.
// Alternatively, we can let createBooking handle it directly by looking at req.cookies or headers, 
// OR we can make it public and let createBooking handle req.user if it exists.
// Since our JWT middleware might throw an error if no token is present, let's create an optional auth middleware inline or just skip it.
// Actually, authenticate middleware usually errors if no token. We'll rely on the client sending token if logged in.
// Let's use an optional auth middleware.

import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.post('/', optionalAuth, createBooking);

export const bookingRouter = router;
