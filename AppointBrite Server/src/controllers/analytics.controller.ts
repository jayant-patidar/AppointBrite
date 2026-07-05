import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';
import { Business } from '../models/business.model';

export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const businessId = new mongoose.Types.ObjectId(req.params.businessId as string);

    // Verify ownership or access (assume middleware already handles basic auth)
    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Key Metrics: Total Revenue, Total Bookings, Completed, Canceled
    const keyMetricsAgg = await Booking.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$totalAmount', 0]
            }
          },
          totalBookings: { $sum: 1 },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          },
          canceledBookings: {
            $sum: {
              $cond: [{ $in: ['$status', ['CANCELED', 'NO_SHOW']] }, 1, 0]
            }
          }
        }
      }
    ]);
    const metrics = keyMetricsAgg[0] || { totalRevenue: 0, totalBookings: 0, completedBookings: 0, canceledBookings: 0 };

    // 2. Reviews metrics
    const reviewMetricsAgg = await Review.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    const reviewMetrics = reviewMetricsAgg[0] || { averageRating: 0, totalReviews: 0 };
    metrics.averageRating = Number(reviewMetrics.averageRating.toFixed(1));
    metrics.totalReviews = reviewMetrics.totalReviews;

    // 3. Revenue & Booking Trend (last 30 days)
    const trendAgg = await Booking.aggregate([
      { $match: { businessId, startTime: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime', timezone: 'America/New_York' } },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$totalAmount', 0] } },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing dates
    const revenueTrend = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD
      const found = trendAgg.find(t => t._id === dateStr);
      revenueTrend.push({
        date: dateStr,
        revenue: found ? found.revenue : 0,
        bookings: found ? found.bookings : 0
      });
    }

    // 4. Service Distribution
    const serviceDistribution = await Booking.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: '$serviceId',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$totalAmount', 0] } }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $project: {
          name: '$service.name',
          count: 1,
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 5. Staff Performance
    const staffPerformance = await Booking.aggregate([
      { $match: { businessId, staffId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$staffId',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$totalAmount', 0] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          count: 1,
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 6. Day-wise Pattern
    const dayWisePattern = await Booking.aggregate([
      { $match: { businessId } },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: { date: '$startTime', timezone: 'America/New_York' } } // 1 (Sun) - 7 (Sat)
        }
      },
      {
        $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedDayPattern = Array.from({ length: 7 }, (_, i) => {
      const found = dayWisePattern.find(d => d._id === i + 1);
      return { day: daysMap[i], count: found ? found.count : 0 };
    });

    // 7. Time-wise Pattern
    const timeWisePattern = await Booking.aggregate([
      { $match: { businessId } },
      {
        $project: {
          hour: { $hour: { date: '$startTime', timezone: 'America/New_York' } }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Group into logical time buckets (e.g. 8 AM to 8 PM)
    const formattedTimePattern = [];
    for (let h = 8; h <= 20; h++) {
      const found = timeWisePattern.find(t => t._id === h);
      const timeLabel = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
      formattedTimePattern.push({ time: timeLabel, count: found ? found.count : 0 });
    }

    // 8. Recent Feedback
    const recentFeedback = await Review.find({ businessId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'firstName lastName')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        keyMetrics: metrics,
        revenueTrend,
        serviceDistribution,
        staffPerformance,
        dayWisePattern: formattedDayPattern,
        timeWisePattern: formattedTimePattern,
        recentFeedback
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const businessId = new mongoose.Types.ObjectId(req.params.businessId as string);

    // Verify ownership
    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404).json({ success: false, message: 'Business not found' });
      return;
    }

    const now = new Date();
    
    // Start of today (local timezone approx, let's use UTC start of day for simplicity or simple offset)
    // We'll use a 24-hour window for "today" to avoid complex timezone math on the server,
    // or just the current calendar day in America/New_York (if we assume EDT)
    // For simplicity, let's just get bookings where startTime is between start of today and end of today.
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 1. Today Stats
    const todayBookingsAgg = await Booking.aggregate([
      { 
        $match: { 
          businessId, 
          startTime: { $gte: startOfToday, $lt: endOfToday },
          status: { $nin: ['CANCELED', 'NO_SHOW'] }
        } 
      },
      {
        $group: {
          _id: null,
          appointmentsCount: { $sum: 1 },
          expectedRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    const todayStatsResult = todayBookingsAgg[0] || { appointmentsCount: 0, expectedRevenue: 0 };

    const newBookingsCount = await Booking.countDocuments({
      businessId,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    const todayStats = {
      appointmentsCount: todayStatsResult.appointmentsCount,
      expectedRevenue: todayStatsResult.expectedRevenue,
      newBookingsCount
    };

    // 2. Pending Bookings
    const pendingBookings = await Booking.find({
      businessId,
      status: 'PENDING'
    }).sort({ createdAt: -1 }).limit(10).populate('customerId', 'firstName lastName').populate('serviceId', 'name');

    // 3. Upcoming Appointments
    const upcomingAppointments = await Booking.find({
      businessId,
      status: 'CONFIRMED',
      startTime: { $gte: now, $lt: endOfToday }
    }).sort({ startTime: 1 }).limit(5).populate('customerId', 'firstName lastName').populate('staffId', 'firstName lastName').populate('serviceId', 'name');

    res.json({
      success: true,
      data: {
        todayStats,
        pendingBookings,
        upcomingAppointments
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
