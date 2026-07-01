import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Business } from './models/business.model';
import { User } from './models/user.model';
import connectDB from './config/database';

dotenv.config();

const seedBusinesses = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Business.deleteMany({});
    await User.deleteMany({});

    console.log('Creating dummy owner...');
    const owner = new User({
      email: 'owner@test.com',
      passwordHash: 'dummy',
      firstName: 'Test',
      lastName: 'Owner',
      role: 'BUSINESS_OWNER'
    });
    await owner.save();

    console.log('Creating mock businesses...');
    const businesses = [
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
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.8, count: 124 },
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
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.9, count: 312 },
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
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.5, count: 89 },
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
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.2, count: 45 },
        subscriptionTier: 'FREE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Bistro 49',
        description: 'Modern European dining with an extensive wine list.',
        category: 'RESTAURANT',
        location: { type: 'Point', coordinates: [-79.3950, 43.6450], address: '200 King St W', city: 'Toronto', zipCode: 'M5V 1H7' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.6, count: 230 },
        subscriptionTier: 'PRO',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'City Health Clinic',
        description: 'Comprehensive medical care and urgent care services.',
        category: 'CLINIC',
        location: { type: 'Point', coordinates: [-79.3800, 43.6550], address: '300 Bay St', city: 'Toronto', zipCode: 'M5H 2Y2' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.7, count: 180 },
        subscriptionTier: 'ENTERPRISE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Zen Oasis Spa',
        description: 'Relaxing massages, facials, and wellness treatments.',
        category: 'SPA',
        location: { type: 'Point', coordinates: [-79.4100, 43.6650], address: '400 Spadina Ave', city: 'Toronto', zipCode: 'M5T 2G7' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.8, count: 400 },
        subscriptionTier: 'PRO',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Math Masters',
        description: 'Expert tutoring in mathematics for all grade levels.',
        category: 'TUTORING',
        location: { type: 'Point', coordinates: [-79.3850, 43.6620], address: '500 College St', city: 'Toronto', zipCode: 'M6G 1A6' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.9, count: 65 },
        subscriptionTier: 'FREE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Pro Cleaners',
        description: 'Top-rated residential and commercial cleaning services.',
        category: 'HOME_SERVICE',
        location: { type: 'Point', coordinates: [-79.3750, 43.6500], address: '600 Church St', city: 'Toronto', zipCode: 'M4Y 2E4' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.5, count: 120 },
        subscriptionTier: 'FREE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Grand Ballroom',
        description: 'Elegant venue for weddings, corporate events, and parties.',
        category: 'EVENT_VENUE',
        location: { type: 'Point', coordinates: [-79.3880, 43.6480], address: '700 Richmond St W', city: 'Toronto', zipCode: 'M5V 1Y1' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 4.7, count: 85 },
        subscriptionTier: 'ENTERPRISE',
        isActive: true
      },
      {
        ownerId: owner._id,
        name: 'Apex Consulting',
        description: 'Business strategy, management, and IT consulting.',
        category: 'CONSULTING',
        location: { type: 'Point', coordinates: [-79.3820, 43.6420], address: '800 Wellington St W', city: 'Toronto', zipCode: 'M5V 3G5' },
        operatingHours: [],
        mediaGallery: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80'],
        rating: { average: 5.0, count: 42 },
        subscriptionTier: 'PRO',
        isActive: true
      }
    ];

    await Business.insertMany(businesses);
    console.log('✅ Mock data seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedBusinesses();
