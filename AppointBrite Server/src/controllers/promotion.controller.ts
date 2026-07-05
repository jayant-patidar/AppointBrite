import type { Request, Response } from 'express';
import { Promotion } from '../models/promotion.model';
import { Business } from '../models/business.model';
import { sendSuccess } from '../utils/apiResponse';

export class PromotionController {
  
  async createPromotion(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { code, type, value, validFrom, validUntil, maxUses, applicableServices } = req.body;

      // Verify business ownership
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ success: false, message: 'Business not found' });
      }
      if (business.ownerId.toString() !== req.user?.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      // Check if code already exists for this business
      const existing = await Promotion.findOne({ businessId, code: code.toUpperCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Promotion code already exists for this business' });
      }

      const promotion = new Promotion({
        businessId,
        code,
        type,
        value,
        validFrom,
        validUntil,
        maxUses,
        applicableServices
      });

      await promotion.save();
      sendSuccess(res, promotion, 'Promotion created successfully', 201);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPromotions(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({ success: false, message: 'Business not found' });
      }
      if (business.ownerId.toString() !== req.user?.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const promotions = await Promotion.find({ businessId })
        .populate('applicableServices', 'name price duration')
        .sort({ createdAt: -1 });

      sendSuccess(res, promotions);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async togglePromotion(req: Request, res: Response) {
    try {
      const { businessId, promotionId } = req.params;
      
      const promotion = await Promotion.findOne({ _id: promotionId, businessId });
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }

      const business = await Business.findById(businessId);
      if (!business || business.ownerId.toString() !== req.user?.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      promotion.isActive = !promotion.isActive;
      await promotion.save();

      sendSuccess(res, promotion, `Promotion ${promotion.isActive ? 'activated' : 'paused'} successfully`);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deletePromotion(req: Request, res: Response) {
    try {
      const { businessId, promotionId } = req.params;

      const business = await Business.findById(businessId);
      if (!business || business.ownerId.toString() !== req.user?.userId) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const promotion = await Promotion.findOneAndDelete({ _id: promotionId, businessId });
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }

      sendSuccess(res, null, 'Promotion deleted successfully');
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePromotion(req: Request, res: Response) {
    try {
      const { businessId, promotionId } = req.params;
      
      const promotion = await Promotion.findOneAndUpdate(
        { _id: promotionId, businessId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }

      sendSuccess(res, promotion, 'Promotion updated successfully');
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Promotion code already exists for this business' });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUBLIC ENDPOINTS

  async getActivePromotions(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      
      const now = new Date();
      
      // Fetch active promotions that haven't expired and haven't hit maxUses
      const query: any = {
        businessId,
        isActive: true,
        $or: [{ validUntil: null }, { validUntil: { $exists: false } }, { validUntil: { $gt: now } }]
      };

      const promotions = await Promotion.find(query)
        .select('code type value validUntil maxUses currentUses')
        .sort({ createdAt: -1 });

      // Filter out those that have hit their global maxUses limit
      const availablePromotions = promotions.filter(promo => {
        if (promo.maxUses && (promo.currentUses || 0) >= promo.maxUses) return false;
        return true;
      });

      sendSuccess(res, availablePromotions);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async validatePromotion(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ success: false, message: 'Promotion code is required' });
      }

      const promotion = await Promotion.findOne({ businessId, code: code.toUpperCase() });

      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Invalid promotion code' });
      }

      if (!promotion.isActive) {
        return res.status(400).json({ success: false, message: 'This promotion code is currently paused' });
      }

      if (promotion.validUntil && new Date(promotion.validUntil) < new Date()) {
        return res.status(400).json({ success: false, message: 'This promotion code has expired' });
      }

      if (promotion.maxUses && (promotion.currentUses || 0) >= promotion.maxUses) {
        return res.status(400).json({ success: false, message: 'This promotion code has reached its usage limit' });
      }

      sendSuccess(res, {
        _id: promotion._id,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value
      }, 'Promotion applied successfully');
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const promotionController = new PromotionController();
