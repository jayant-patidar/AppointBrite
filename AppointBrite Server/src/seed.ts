import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Business } from './models/business.model';
import { User } from './models/user.model';
import { Service } from './models/service.model';
import { Booking } from './models/booking.model';
import { Review } from './models/review.model';
import connectDB from './config/database';

dotenv.config();

const generateOperatingHours = () => {
  return [
    { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00', isClosed: false },
    { dayOfWeek: 2, openTime: '09:00', closeTime: '17:00', isClosed: false },
    { dayOfWeek: 3, openTime: '09:00', closeTime: '17:00', isClosed: false },
    { dayOfWeek: 4, openTime: '09:00', closeTime: '19:00', isClosed: false },
    { dayOfWeek: 5, openTime: '09:00', closeTime: '19:00', isClosed: false },
    { dayOfWeek: 6, openTime: '10:00', closeTime: '16:00', isClosed: false },
    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
  ];
};

const seedBusinesses = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Business.deleteMany({});
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('Creating dummy owner and customers...');
    const owner = new User({
      email: 'owner@test.com',
      passwordHash: 'dummy',
      firstName: 'Test',
      lastName: 'Owner',
      role: 'BUSINESS_OWNER'
    });
    await owner.save();

    const customer1 = new User({
      email: 'customer1@test.com',
      passwordHash: 'dummy',
      firstName: 'Alice',
      lastName: 'Smith',
      role: 'CUSTOMER'
    });
    await customer1.save();

    const customer2 = new User({
      email: 'customer2@test.com',
      passwordHash: 'dummy',
      firstName: 'Bob',
      lastName: 'Jones',
      role: 'CUSTOMER'
    });
    await customer2.save();

    console.log('Creating mock businesses...');
    const businessesData = [
      {
        ownerId: owner._id,
        name: 'Luxe Hair & Spa',
        description: 'Premium hair styling and spa services for the ultimate relaxation experience.',
        category: 'SALON',
        location: {
          type: 'Point',
          coordinates: [-79.3832, 43.6532],
          address: '123 Queen St W',
          city: 'Toronto',
          zipCode: 'M5H 2N2'
        },
        operatingHours: generateOperatingHours(),
        mediaGallery: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1521590832167-7bfc1748b565?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80'
        ],
        rating: { average: 4.8, count: 2 }, // Will match review count below
        subscriptionTier: 'PRO',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Iron Temple Fitness',
        description: '24/7 gym with personal training, group classes, and top-tier equipment.',
        category: 'FITNESS',
        location: {
          type: 'Point',
          coordinates: [-79.3900, 43.6600],
          address: '456 Yonge St',
          city: 'Toronto',
          zipCode: 'M4Y 1X9'
        },
        operatingHours: generateOperatingHours(),
        mediaGallery: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.9, count: 1 },
        subscriptionTier: 'PRO',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Smile Bright Dental',
        description: 'Family dentistry specializing in cosmetic and pediatric care.',
        category: 'DENTAL',
        location: {
          type: 'Point',
          coordinates: [-79.4000, 43.6700],
          address: '789 Bloor St W',
          city: 'Toronto',
          zipCode: 'M6G 1L5'
        },
        operatingHours: generateOperatingHours(),
        mediaGallery: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.5, count: 0 },
        subscriptionTier: 'FREE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'QuickFix Auto Repair',
        description: 'Reliable and fast auto repair, oil changes, and diagnostics.',
        category: 'AUTO_SERVICE',
        location: {
          type: 'Point',
          coordinates: [-79.3700, 43.6400],
          address: '101 Front St E',
          city: 'Toronto',
          zipCode: 'M5E 1C2'
        },
        operatingHours: generateOperatingHours(),
        mediaGallery: ['https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.2, count: 0 },
        subscriptionTier: 'FREE',
        isActive: true
      }
    ];

    const insertedBusinesses = await Business.insertMany(businessesData);
    
    console.log('Creating services, bookings, and reviews...');
    
    for (const biz of insertedBusinesses) {
      // 1. Create Services
      let services = [];
      if (biz.category === 'SALON') {
        services = await Service.insertMany([
          { businessId: biz._id, name: 'Signature Haircut', description: 'Includes consultation, wash, cut, and style.', price: 45, durationMinutes: 45, bufferMinutes: 15, isActive: true },
          { businessId: biz._id, name: 'Color & Highlights', description: 'Full color treatment with partial highlights.', price: 120, durationMinutes: 120, bufferMinutes: 30, isActive: true },
          { businessId: biz._id, name: 'Deep Tissue Massage', description: 'Therapeutic massage.', price: 85, durationMinutes: 60, bufferMinutes: 15, isActive: true }
        ]);
      } else if (biz.category === 'FITNESS') {
        services = await Service.insertMany([
          { businessId: biz._id, name: '1-on-1 Personal Training', description: 'One hour intensive personal training session.', price: 60, durationMinutes: 60, bufferMinutes: 0, isActive: true },
          { businessId: biz._id, name: 'Group HIIT Class', description: 'High-intensity interval training for 45 minutes.', price: 20, durationMinutes: 45, bufferMinutes: 15, isActive: true }
        ]);
      } else {
        services = await Service.insertMany([
          { businessId: biz._id, name: 'Standard Consultation', description: 'Standard service consultation.', price: 50, durationMinutes: 30, bufferMinutes: 0, isActive: true }
        ]);
      }

      // 2. Create Bookings and Reviews for SALON and FITNESS to test ReviewList
      if (biz.category === 'SALON') {
        const b1 = await Booking.create({
          customerId: customer1._id, businessId: biz._id, serviceId: services[0]._id, 
          startTime: new Date(Date.now() - 86400000 * 2), endTime: new Date(Date.now() - 86400000 * 2 + 3600000),
          status: 'COMPLETED', paymentStatus: 'PAID', totalAmount: 45
        });
        await Review.create({
          bookingId: b1._id, businessId: biz._id, customerId: customer1._id, rating: 5,
          comment: 'Absolutely amazing experience! The staff was incredibly professional and the service was top-notch.',
          createdAt: new Date(Date.now() - 86400000 * 2)
        });

        const b2 = await Booking.create({
          customerId: customer2._id, businessId: biz._id, serviceId: services[1]._id,
          startTime: new Date(Date.now() - 86400000 * 10), endTime: new Date(Date.now() - 86400000 * 10 + 3600000),
          status: 'COMPLETED', paymentStatus: 'PAID', totalAmount: 120
        });
        await Review.create({
          bookingId: b2._id, businessId: biz._id, customerId: customer2._id, rating: 4,
          comment: 'Very clean and relaxing environment. They ran a little late but made up for it.',
          responseFromBusiness: 'Thank you for your feedback! We apologize for the wait and hope to see you again soon.',
          createdAt: new Date(Date.now() - 86400000 * 10)
        });
      }

      if (biz.category === 'FITNESS') {
        const b3 = await Booking.create({
          customerId: customer1._id, businessId: biz._id, serviceId: services[0]._id,
          startTime: new Date(Date.now() - 86400000 * 5), endTime: new Date(Date.now() - 86400000 * 5 + 3600000),
          status: 'COMPLETED', paymentStatus: 'PAID', totalAmount: 60
        });
        await Review.create({
          bookingId: b3._id, businessId: biz._id, customerId: customer1._id, rating: 5,
          comment: 'Killer workout! The trainer really pushed me to my limits.',
          createdAt: new Date(Date.now() - 86400000 * 5)
        });
      }
    }

    console.log('✅ Mock data seeded successfully with services and reviews!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedBusinesses();
