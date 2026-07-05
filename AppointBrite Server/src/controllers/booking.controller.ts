import { Request, Response } from 'express';
import { fromZonedTime } from 'date-fns-tz';
import { Booking } from '../models/booking.model';
import { Business } from '../models/business.model';
import { Service } from '../models/service.model';

/**
 * Helper function to generate time slots based on operating hours and duration.
 */
function generateTimeSlots(targetDateStr: string, openTime: string, closeTime: string, durationMinutes: number): Date[] {
  const slots: Date[] = [];
  
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  let currentMin = openHour * 60 + openMin;
  const endMin = closeHour * 60 + closeMin;
  const interval = 30;

  while (currentMin + durationMinutes <= endMin) {
    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    
    // Construct local date-time string: 'YYYY-MM-DDTHH:mm:00'
    const dateTimeStr = `${targetDateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    
    // Convert this local New York time to a proper UTC Date
    const slotTime = fromZonedTime(dateTimeStr, 'America/New_York');
    slots.push(slotTime);
    currentMin += interval;
  }

  return slots;
}

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      res.status(400).json({ success: false, message: 'Date and serviceId are required' });
      return;
    }

    const business = await Business.findById(businessId).lean();
    const service = await Service.findById(serviceId).lean();

    if (!business || !service) {
      res.status(404).json({ success: false, message: 'Business or Service not found' });
      return;
    }

    // 1. Determine day of week
    const targetDate = new Date(date as string);
    const dayOfWeek = targetDate.getUTCDay(); // 0 (Sun) to 6 (Sat)

    // 2. Get operating hours
    const operatingHours = business.operatingHours.find((h) => h.dayOfWeek === dayOfWeek);
    
    if (!operatingHours || operatingHours.isClosed) {
      res.status(200).json({ success: true, data: [] }); // No slots available
      return;
    }

    // 3. Total duration needed
    const totalDuration = service.durationMinutes + service.bufferMinutes;

    // 4. Generate all possible slots for the day in EST
    const allSlots = generateTimeSlots(date as string, operatingHours.openTime, operatingHours.closeTime, totalDuration);

    // 5. Fetch existing bookings for this business on this date
    // Start of day in EST
    const startOfDay = fromZonedTime(`${date}T00:00:00`, 'America/New_York');
    // End of day in EST
    const endOfDay = fromZonedTime(`${date}T23:59:59`, 'America/New_York');

    const existingBookings = await Booking.find({
      businessId,
      status: { $in: ['PENDING', 'CONFIRMED'] },
      startTime: { $gte: startOfDay, $lt: endOfDay }
    }).lean();

    // 6. Filter out unavailable slots
    // For each slot, check if it overlaps with any existing booking.
    // If it overlaps, check if capacity is reached.
    const availableSlots = allSlots.filter((slot) => {
      const slotStartTime = slot.getTime();
      const slotEndTime = slot.getTime() + totalDuration * 60 * 1000;

      // Find overlapping bookings
      const overlaps = existingBookings.filter((booking) => {
        const bStart = new Date(booking.startTime).getTime();
        const bEnd = new Date(booking.endTime).getTime();
        return (slotStartTime < bEnd && slotEndTime > bStart);
      });

      // If overlapping bookings reach service capacity, this slot is unavailable
      const currentLoad = overlaps.reduce((sum, b) => sum + (b.partySize || 1), 0);
      return currentLoad < (service.capacity || 1);
    });

    // Also filter out slots in the past
    const now = new Date().getTime();
    const futureSlots = availableSlots.filter(s => s.getTime() > now);

    res.status(200).json({
      success: true,
      data: futureSlots.map(s => s.toISOString())
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking availability' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      businessId, serviceId, staffId, startTime, guestDetails, partySize, partyMembers, specialRequests 
    } = req.body;
    
    // Auth user if they exist
    const customerId = (req as any).user?.userId;

    if (!customerId && !guestDetails) {
      res.status(400).json({ success: false, message: 'Guest details required if not logged in.' });
      return;
    }

    const service = await Service.findById(serviceId).lean();
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    const totalDuration = service.durationMinutes + service.bufferMinutes;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalDuration * 60 * 1000);

    // Simple validation: check if requested slot overlaps with capacity
    const overlapping = await Booking.find({
      businessId,
      status: { $in: ['PENDING', 'CONFIRMED'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    const currentLoad = overlapping.reduce((sum, b) => sum + (b.partySize || 1), 0);
    const requestedLoad = partySize || 1;

    if (currentLoad + requestedLoad > (service.capacity || 1)) {
      console.error('Validation failed: Time slot is no longer available.', { currentLoad, requestedLoad, capacity: service.capacity });
      res.status(400).json({ success: false, message: 'Time slot is no longer available.' });
      return;
    }

    // Determine initial status based on service settings
    const status = service.requiresApproval ? 'PENDING' : 'CONFIRMED';
    
    const estimatedCost = service.price * requestedLoad;

    const newBooking = new Booking({
      customerId,
      businessId,
      serviceId,
      staffId,
      startTime: start,
      endTime: end,
      status,
      paymentStatus: 'PENDING',
      totalAmount: estimatedCost,
      estimatedCost,
      guestDetails,
      partySize: requestedLoad,
      partyMembers,
      specialRequests
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      data: newBooking,
      message: status === 'CONFIRMED' ? 'Booking confirmed!' : 'Booking request sent for approval.'
    });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: Object.values(error.errors).map((val: any) => val.message).join(', ') });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.userId;
    if (!customerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const now = new Date();

    // Lazy update: Mark past confirmed bookings as COMPLETED
    await Booking.updateMany(
      { customerId, status: 'CONFIRMED', endTime: { $lt: now } },
      { $set: { status: 'COMPLETED' } }
    );

    // Lazy update: Mark past pending bookings as CANCELED
    await Booking.updateMany(
      { customerId, status: 'PENDING', endTime: { $lt: now } },
      { $set: { status: 'CANCELED' } }
    );

    const bookings = await Booking.find({ customerId })
      .populate('businessId', 'name location mediaGallery category')
      .populate('serviceId', 'name durationMinutes price')
      .populate('staffId', 'firstName lastName')
      .sort({ startTime: -1 })
      .lean();

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.userId;
    const { id } = req.params;

    if (!customerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const booking = await Booking.findOne({ _id: id, customerId });
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (['CANCELED', 'COMPLETED', 'NO_SHOW'].includes(booking.status)) {
      res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
      return;
    }

    booking.status = 'CANCELED';
    await booking.save();

    res.status(200).json({ success: true, data: booking, message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error canceling booking' });
  }
};

export const rescheduleBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = (req as any).user?.userId;
    const { id } = req.params;
    const { newStartTime } = req.body;

    if (!customerId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const booking = await Booking.findOne({ _id: id, customerId });
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (['CANCELED', 'COMPLETED', 'NO_SHOW'].includes(booking.status)) {
      res.status(400).json({ success: false, message: `Cannot reschedule a ${booking.status.toLowerCase()} booking` });
      return;
    }

    const service = await Service.findById(booking.serviceId).lean();
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    const totalDuration = service.durationMinutes + service.bufferMinutes;
    const start = new Date(newStartTime);
    const end = new Date(start.getTime() + totalDuration * 60 * 1000);

    // Validate availability
    const overlapping = await Booking.find({
      businessId: booking.businessId,
      _id: { $ne: booking._id }, // Ignore current booking
      status: { $in: ['PENDING', 'CONFIRMED'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    const currentLoad = overlapping.reduce((sum, b) => sum + (b.partySize || 1), 0);
    const requestedLoad = booking.partySize || 1;

    if (currentLoad + requestedLoad > (service.capacity || 1)) {
      res.status(400).json({ success: false, message: 'Selected time slot is not available' });
      return;
    }

    booking.startTime = start;
    booking.endTime = end;
    // Rescheduling might require re-approval depending on business settings, but for now we keep it CONFIRMED if it was.
    await booking.save();

    res.status(200).json({ success: true, data: booking, message: 'Booking rescheduled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error rescheduling booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.customerId?.toString() !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
      return;
    }

    if (!['CANCELED', 'NO_SHOW'].includes(booking.status)) {
      res.status(400).json({ success: false, message: 'Only canceled or no-show bookings can be deleted' });
      return;
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting booking' });
  }
};

export const getBusinessBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId } = req.params;
    
    // Auth check is handled by middleware (we know the user is STAFF or BUSINESS_OWNER)
    // We should ideally verify they belong to THIS businessId, assuming that's checked in future middleware,
    // or just assume for now the client only requests their own.

    const now = new Date();

    // Lazy update: Mark past confirmed bookings as COMPLETED
    await Booking.updateMany(
      { businessId, status: 'CONFIRMED', endTime: { $lt: now } },
      { $set: { status: 'COMPLETED' } }
    );

    // Lazy update: Mark past pending bookings as CANCELED
    await Booking.updateMany(
      { businessId, status: 'PENDING', endTime: { $lt: now } },
      { $set: { status: 'CANCELED' } }
    );

    const bookings = await Booking.find({ businessId })
      .populate('customerId', 'firstName lastName email phone profilePicture')
      .populate('serviceId', 'name durationMinutes price')
      .populate('staffId', 'firstName lastName')
      .sort({ startTime: -1 })
      .lean();

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching business bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching business bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessId, bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const booking = await Booking.findOne({ _id: bookingId, businessId });
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate('customerId', 'firstName lastName email phone profilePicture')
      .populate('serviceId', 'name durationMinutes price')
      .populate('staffId', 'firstName lastName')
      .lean();

    res.status(200).json({ success: true, data: updatedBooking, message: `Booking status updated to ${status}` });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Server error updating booking status' });
  }
};
