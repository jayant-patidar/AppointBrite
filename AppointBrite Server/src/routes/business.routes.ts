import { Router } from 'express';
import { searchBusinesses } from '../controllers/business.controller';

const router = Router();

router.get('/search', searchBusinesses);

export const businessRouter = router;
