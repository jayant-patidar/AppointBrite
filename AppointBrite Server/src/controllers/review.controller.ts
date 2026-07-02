import { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { Booking } from '../models/booking.model';
import { Business } from '../models/business.model';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.userId;
    const { bookingId, rating, comment } = req.body;

    if (!customerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!bookingId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({ _id: bookingId, customerId });
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.status !== 'COMPLETED') {
      res.status(400).json({ success: false, message: 'Can only review completed bookings' });
      return;
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      res.status(400).json({ success: false, message: 'Review already exists for this booking' });
      return;
    }

    const review = new Review({
      bookingId,
      businessId: booking.businessId,
      customerId,
      rating,
      comment
    });

    await review.save();

    // Optionally update business average rating
    const business = await Business.findById(booking.businessId);
    if (business) {
      const currentRating = business.rating.average || 0;
      const count = business.rating.count || 0;
      business.rating.average = ((currentRating * count) + rating) / (count + 1);
      business.rating.count = count + 1;
      await business.save();
    }

    res.status(201).json({ success: true, data: review, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
};
