# Document 02 — Product Requirements Document (PRD) (v1.0)
**Project Name:** AppointBrite

## 1. User Journeys

### Customer Journey
1. **Discovery:** User opens AppointBrite and searches for a service (e.g., “haircut near me” or “Italian restaurant”).
2. **Comparison:** User views businesses, filtering by ratings, price, and real-time availability.
3. **Selection:** User selects a time slot and specific staff member (if applicable).
4. **Booking:** User confirms the booking and (optionally) pays a deposit.
5. **Pre-Service:** User receives push/SMS reminders and updates.
6. **Post-Service:** User completes the service and is prompted to leave a review and re-book.

### Business Journey
1. **Onboarding:** Business signs up, verifies identity, and creates a profile (services, pricing, business hours, staff).
2. **Inventory Management:** Business sets availability calendar and booking rules (e.g., minimum notice required).
3. **Fulfillment:** Business receives booking requests (auto-accepted or manual review).
4. **Operations:** Staff manage the daily schedule dashboard, checking in customers and processing final payments.
5. **Growth:** Owner tracks analytics, revenue, and customer reviews to optimize operations.

## 2. Core Features: Customer Portal (Web & App)

- **User Authentication:** Sign up/Login via Email, Google, Apple.
- **Search & Discovery Engine:** Search by category, geolocation, date/time, and keywords.
- **Interactive Map:** View available businesses on a map layout.
- **Business Profiles:** View business details, photos, service menus, prices, and verified reviews.
- **Real-Time Booking Flow:** Select service -> Choose staff -> Pick time slot -> Confirm.
- **User Dashboard:** View upcoming, past, and canceled appointments.
- **Notifications:** Push notifications, SMS, and email alerts for confirmations and reminders.
- **Favorites & Re-booking:** Save favorite businesses and quickly repeat past bookings.
- **Review System:** Rate and write reviews (only after verified attendance).

## 3. Core Features: Business Portal (SaaS Dashboard)

- **Business Authentication & Verification:** Secure login and business KYC verification.
- **Profile Management:** Update business info, operating hours, and media gallery.
- **Service & Menu Management:** Add/edit services, prices, duration, and assigned staff.
- **Staff Management:** Create staff profiles, set individual schedules, and assign permissions.
- **Dynamic Calendar & Scheduling:** 
  - Centralized calendar view (Day/Week/Month).
  - Drag-and-drop rescheduling.
  - Block out personal time or holidays.
- **Booking Management:** Accept, reject, or modify incoming customer bookings.
- **Customer CRM:** View client history, notes, preferences, and contact info.
- **Analytics Dashboard:** Metrics on revenue, booking volume, no-show rates, and top services.
- **Promotions:** Create discount codes or flash sales to fill empty slots.

## 4. Core Features: Super Admin Portal

- **User & Business Management:** Suspend accounts, verify new businesses, handle disputes.
- **Content Moderation:** Monitor and remove inappropriate reviews or images.
- **Platform Analytics:** Track total platform GMV (Gross Merchandise Value), active users, and commission revenue.
- **Category Management:** Add new business categories, service types, and dynamic configuration rules.
- **Financial Dashboard:** Manage payouts to businesses and track transaction fees.

## 5. Non-Functional Requirements

- **Performance:** Search results must load in under 2 seconds. Calendar updates must be real-time (WebSockets).
- **Scalability:** System must handle spikes in traffic during peak booking hours (e.g., Friday evenings).
- **Security:** GDPR and CCPA compliant data handling. PCI-DSS compliance for payment processing via Stripe.
- **Availability:** 99.9% uptime SLA for the core booking engine.
- **Responsive Design:** Customer portal must be mobile-first. Business portal must be optimized for tablets and desktops (front-desk use).

## 6. MVP (Minimum Viable Product) Scope

**In Scope for MVP:**
- Basic Authentication (Email/Password).
- Core search and category filtering.
- Business profiles with static service lists.
- Real-time booking engine and calendar management.
- Simple Customer and Business dashboards.
- Email notifications.

**Out of Scope for MVP (Phase 2+):**
- Complex multi-location enterprise support.
- AI-powered recommendations.
- Loyalty programs and gift cards.
- Integrated POS (Point of Sale) hardware.
- Advanced SMS marketing tools.
