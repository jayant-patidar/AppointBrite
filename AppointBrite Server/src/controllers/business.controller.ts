import { Request, Response } from 'express';
import { Business } from '../models/business.model';

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
