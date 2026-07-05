import { Request, Response } from 'express';
import { Business } from '../models/business.model';
import { Service } from '../models/service.model';
import { Review } from '../models/review.model';
import { Staff } from '../models/staff.model';
import { Booking } from '../models/booking.model';
import mongoose from 'mongoose';

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

export const getBusinessStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.find({ businessId: req.params.id })
      .populate('userId', 'firstName lastName profileImage')
      .lean();
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching staff' });
  }
};

/**
 * @route   GET /api/v1/businesses/my-business
 * @desc    Get logged in user's business profile
 * @access  Private (Business Owner)
 */
export const getMyBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const business = await Business.findOne({ ownerId: req.user.userId }).lean();
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }
    res.status(200).json({ success: true, data: business });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error getting business profile' });
  }
};

/**
 * @route   PATCH /api/v1/businesses/my-business
 * @desc    Update business onboarding step or settings
 * @access  Private
 */
export const updateMyBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    if (req.user.role !== 'BUSINESS_OWNER') {
      res.status(403).json({ success: false, message: 'Only business owners can update business details' });
      return;
    }

    const business = await Business.findOne({ ownerId: req.user.userId });
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const updates = req.body;
    
    if (updates.onboardingStep === 4) {
      business.isActive = true;
    }

    if (updates.location) {
      updates.location.type = 'Point';
      if (!updates.location.coordinates || updates.location.coordinates.length === 0) {
        // Fallback coordinates since 2dsphere requires them
        updates.location.coordinates = [0, 0];
      }
    }

    Object.assign(business, updates);
    await business.save();

    res.status(200).json({ success: true, data: business });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error updating business profile' });
  }
};

/**
 * @route   GET /api/v1/businesses/:businessId/customers
 * @desc    Get all unique customers for a business
 * @access  Private (Business Owner / Staff)
 */
export const getBusinessCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;

    // Use aggregation to group bookings by customer
    const customers = await Booking.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(businessId as string) } },
      {
        $group: {
          _id: {
            customerId: '$customerId',
            guestEmail: '$guestDetails.email'
          },
          totalBookings: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $in: ['$status', ['COMPLETED', 'CONFIRMED']] }, '$totalAmount', 0]
            }
          },
          lastVisitDate: { $max: '$startTime' },
          customerId: { $first: '$customerId' },
          guestDetails: { $first: '$guestDetails' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $unwind: {
          path: '$customerInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          customerId: 1,
          isGuest: { $cond: [{ $ifNull: ['$customerId', false] }, false, true] },
          firstName: { $ifNull: ['$customerInfo.firstName', '$guestDetails.firstName'] },
          lastName: { $ifNull: ['$customerInfo.lastName', '$guestDetails.lastName'] },
          email: { $ifNull: ['$customerInfo.email', '$guestDetails.email'] },
          phone: { $ifNull: ['$customerInfo.phone', '$guestDetails.phone'] },
          totalBookings: 1,
          totalRevenue: 1,
          lastVisitDate: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const business = await Business.findById(businessId).select('bannedCustomers').lean();
    const bannedCustomers = business?.bannedCustomers || [];

    const customersWithBanStatus = customers.map(c => {
      const isBanned = bannedCustomers.some(b => 
        (c.email && b.email === c.email) || 
        (c.phone && b.phone === c.phone) || 
        (c.customerId && b.customerId?.toString() === c.customerId.toString())
      );
      return { ...c, isBanned };
    });

    res.status(200).json({ success: true, data: customersWithBanStatus });
  } catch (error: any) {
    console.error('Error fetching business customers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching customers' });
  }
};

/**
 * @route   POST /api/v1/businesses/:businessId/ban-customer
 * @desc    Ban or unban a customer from booking
 * @access  Private (Business Owner / Staff)
 */
export const banCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { email, phone, customerId, reason, action } = req.body; // action: 'BAN' | 'UNBAN'

    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    if (!business.bannedCustomers) {
      business.bannedCustomers = [];
    }

    if (action === 'BAN') {
      const alreadyBanned = business.bannedCustomers.some(b => 
        (email && b.email === email) || 
        (phone && b.phone === phone) || 
        (customerId && b.customerId?.toString() === customerId)
      );

      if (!alreadyBanned) {
        business.bannedCustomers.push({
          email,
          phone,
          customerId: customerId || undefined,
          reason,
          bannedAt: new Date()
        });
      }
    } else if (action === 'UNBAN') {
      business.bannedCustomers = business.bannedCustomers.filter(b => 
        !((email && b.email === email) || 
          (phone && b.phone === phone) || 
          (customerId && b.customerId?.toString() === customerId))
      );
    }

    await business.save();

    res.status(200).json({ success: true, message: `Customer ${action === 'BAN' ? 'banned' : 'unbanned'} successfully.` });
  } catch (error: any) {
    console.error('Error banning customer:', error);
    res.status(500).json({ success: false, message: 'Server error updating ban status' });
  }
};
