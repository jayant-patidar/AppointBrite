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
}

export const promotionController = new PromotionController();
