import { Request, Response } from 'express';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).populate({
      path: 'favorites',
      select: 'name category location mediaGallery rating operatingHours',
    }).lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user.favorites || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching favorites' });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { businessId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      res.status(400).json({ success: false, message: 'Invalid business ID' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: businessId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Added to favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error adding favorite' });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { businessId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: businessId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Removed from favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error removing favorite' });
  }
};
