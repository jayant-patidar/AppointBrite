import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:businessId', removeFavorite);

export const userRouter = router;
