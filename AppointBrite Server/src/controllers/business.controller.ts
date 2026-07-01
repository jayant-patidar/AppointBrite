import { Request, Response } from 'express';
import { Business } from '../models/business.model';
import { Service } from '../models/service.model';
import { Review } from '../models/review.model';

/**
 * @route   GET /api/v1/businesses
 * @desc    Search and filter businesses
 * @access  Public
 */
export const searchBusinesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category, limit = '20', page = '1' } = req.query;
    
    const query: any = { isActive: true };

    if (category) {
      query.category = (category as string).toUpperCase();
    }

    if (q) {
      // Assuming a text index exists on name and description
      query.$text = { $search: q as string };
    }

    const parsedLimit = parseInt(limit as string, 10) || 20;
    const parsedPage = parseInt(page as string, 10) || 1;
    const skip = (parsedPage - 1) * parsedLimit;

    const sortOptions: any = q 
      ? { score: { $meta: 'textScore' } } 
      : { 'rating.average': -1, createdAt: -1 };

    const businesses = await Business.find(query)
      .select('-__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const total = await Business.countDocuments(query);

    res.status(200).json({
      success: true,
      data: businesses,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching businesses' });
  }
};

export const getBusinessById = async (req: Request, res: Response): Promise<void> => {
  try {
    const business = await Business.findById(req.params.id).lean();
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching business' });
  }
};

export const getBusinessServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ businessId: req.params.id, isActive: true }).lean();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching services' });
  }
};

export const getBusinessReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ businessId: req.params.id })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching reviews' });
  }
};
