# Document 04 — Database Design (v1.0)
**Project Name:** AppointBrite
**Database:** MongoDB

## 1. Design Philosophy

The database schema is designed to be highly flexible to accommodate different business types (e.g., hair salons vs. restaurants). We use Mongoose schemas with strong typing to maintain data integrity.

## 2. Core Collections

### 1. `users`
Stores all platform users (customers, business owners, and staff). We use a generic User model with a `role` field.

```typescript
{
  _id: ObjectId,
  email: String (Unique, Indexed),
  passwordHash: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: Enum ["CUSTOMER", "BUSINESS_OWNER", "STAFF", "SUPER_ADMIN"],
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `businesses`
Stores the profile and configuration for each business entity.

```typescript
{
  _id: ObjectId,
  ownerId: ObjectId (Ref: User),
  name: String,
  description: String,
  category: Enum ["SALON", "RESTAURANT", "CLINIC", "FITNESS", ...],
  location: {
    type: "Point",
    coordinates: [longitude, latitude], // Geospatial Index for searching
    address: String,
    city: String,
    zipCode: String
  },
  operatingHours: [
    {
      dayOfWeek: Number (0-6),
      openTime: String ("09:00"),
      closeTime: String ("17:00"),
      isClosed: Boolean
    }
  ],
  mediaGallery: [String],
  rating: {
    average: Number,
    count: Number
  },
  subscriptionTier: Enum ["FREE", "PRO", "ENTERPRISE"],
  stripeAccountId: String,
  isActive: Boolean,
  createdAt: Date
}
```

### 3. `services`
Stores the services offered by businesses.

```typescript
{
  _id: ObjectId,
  businessId: ObjectId (Ref: Business, Indexed),
  name: String,
  description: String,
  price: Number,
  durationMinutes: Number,
  bufferMinutes: Number, // Clean-up time after service
  isActive: Boolean
}
```

### 4. `staff` (Optional Configuration)
Maps users (staff) to specific businesses and services.

```typescript
{
  _id: ObjectId,
  userId: ObjectId (Ref: User),
  businessId: ObjectId (Ref: Business),
  providedServices: [ObjectId] (Ref: Service),
  workingHours: [ /* Similar to business operatingHours */ ],
  colorCode: String // For calendar UI
}
```

### 5. `bookings`
The central transaction record connecting a user, a service, and a time slot.

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (Ref: User, Indexed),
  businessId: ObjectId (Ref: Business, Indexed),
  serviceId: ObjectId (Ref: Service),
  staffId: ObjectId (Ref: Staff, Optional),
  startTime: Date,
  endTime: Date,
  status: Enum ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED", "NO_SHOW"],
  paymentStatus: Enum ["PENDING", "PAID", "REFUNDED"],
  totalAmount: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. `reviews`
Verified feedback from customers after a completed booking.

```typescript
{
  _id: ObjectId,
  bookingId: ObjectId (Ref: Booking, Unique),
  businessId: ObjectId (Ref: Business),
  customerId: ObjectId (Ref: User),
  rating: Number (1-5),
  comment: String,
  responseFromBusiness: String,
  createdAt: Date
}
```

## 3. Key Indexes for Performance

1. **Geospatial Search:** `db.businesses.createIndex({ location: "2dsphere" })` - Critical for "near me" searches.
2. **Availability Checks:** `db.bookings.createIndex({ businessId: 1, startTime: 1, endTime: 1 })` - Speeds up checking for overlapping appointments.
3. **User Bookings:** `db.bookings.createIndex({ customerId: 1, startTime: -1 })` - Speeds up user dashboard load times.
4. **Text Search:** `db.businesses.createIndex({ name: "text", category: "text" })` - Enables keyword searching.

## 4. Data Relationships & Aggregation

- We heavily rely on MongoDB's `$lookup` for populating Dashboard views (e.g., getting all `bookings` for a `business` and joining `services` and `users`).
- Business `rating` is denormalized (stored directly on the `business` document) and updated via an aggregation trigger whenever a new `review` is added.
