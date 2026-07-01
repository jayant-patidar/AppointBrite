# Document 05 — API Specification (v1.0)
**Project Name:** AppointBrite
**Architecture:** RESTful over HTTP/HTTPS
**Data Format:** JSON

## 1. API Design Principles

- **Base URL:** `/api/v1`
- **Authentication:** Bearer token (JWT) in Authorization header.
- **Pagination:** Uses `page` and `limit` query parameters. Response includes metadata (`totalItems`, `totalPages`).
- **Standard Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```
- **Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```

## 2. Core Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register`: Register a new user (customer or business owner).
- `POST /login`: Authenticate and return JWT access/refresh tokens.
- `POST /logout`: Invalidate refresh token.
- `GET /me`: Get current authenticated user profile.

### Businesses (`/api/v1/businesses`)

- `GET /search`: Search businesses.
  - **Query Params:** `lat`, `lng`, `radius`, `category`, `q` (keyword).
- `GET /:id`: Get public profile of a specific business (includes services and operating hours).
- `POST /`: Create a new business profile (Requires `BUSINESS_OWNER` role).
- `PUT /:id`: Update business details.
- `GET /:id/availability`: Get available time slots for a given date.
  - **Query Params:** `date` (YYYY-MM-DD), `serviceId`.

### Services (`/api/v1/businesses/:businessId/services`)

- `GET /`: List all services for a business.
- `POST /`: Add a new service.
- `PUT /:serviceId`: Update a service.
- `DELETE /:serviceId`: Mark service as inactive.

### Bookings (`/api/v1/bookings`)

- `POST /`: Create a new booking (requires Auth).
  - **Payload:** `{ businessId, serviceId, staffId, startTime }`
- `GET /me`: Get current user's bookings.
- `GET /business/:businessId`: Get all bookings for a business (Requires `BUSINESS_OWNER` or `STAFF` role).
  - **Query Params:** `startDate`, `endDate`, `status`.
- `PUT /:id/status`: Update booking status (e.g., CONFIRM, CANCEL, NO_SHOW).
  - **Payload:** `{ status: "CANCELED" }`

### Reviews (`/api/v1/reviews`)

- `POST /`: Submit a review.
  - **Payload:** `{ bookingId, rating, comment }`
- `GET /business/:businessId`: Get paginated reviews for a business.

## 3. WebSocket Events (Real-Time)

Using Socket.IO connected to namespace `/dashboard`.

- **Client Emits:** `joinRoom({ businessId })` - Staff/Owner joins their specific business room.
- **Server Emits:** 
  - `NEW_BOOKING`: Dispatched when a customer completes a booking. Payload contains booking details.
  - `BOOKING_CANCELED`: Dispatched if a user cancels.
  - `STATUS_UPDATED`: Dispatched when a booking status changes (e.g., front desk checks someone in).

## 4. Webhooks (External Integrations)

- `POST /api/v1/webhooks/stripe`: Handles Stripe payment intents, successful charges, and refund events. Updates the `paymentStatus` in the `bookings` collection.
