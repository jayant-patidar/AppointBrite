/**
 * API Router entry point.
 */
import { Router } from 'express';
import { authRouter } from './auth.routes';
import { businessRouter } from './business.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/businesses', businessRouter);
// TODO: Add booking, user routes

export const apiRouter = router;
