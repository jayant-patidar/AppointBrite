# Document 08 — Project Roadmap (v1.0)
**Project Name:** AppointBrite

## Phase 1: MVP (Months 1-3) - "The Core Booking Engine"
**Goal:** Build a functional end-to-end booking flow for a single vertical (e.g., Salons & Spas) to prove market demand and system stability.

### Milestones
- **M1.1 Infrastructure & Architecture:** Set up MERN boilerplate, CI/CD pipelines, Docker, and AWS staging environment.
- **M1.2 Auth & User Profiles:** JWT authentication, user registration, and basic business onboarding.
- **M1.3 Search & Discovery:** Implement MongoDB geospatial search, category filtering, and public business profiles.
- **M1.4 Booking Engine:** Real-time calendar availability logic, booking creation, and conflict resolution.
- **M1.5 Business Dashboard (V1):** Simple calendar view for business owners to accept/reject and view bookings.

*Deliverable:* A working web app where users can find a test salon and successfully book an appointment.

## Phase 2: Monetization & Operations (Months 4-6) - "Business Ready"
**Goal:** Add features necessary for businesses to run their day-to-day operations entirely on AppointBrite and implement the revenue model.

### Milestones
- **M2.1 Payment Gateway:** Integrate Stripe Connect for online payments, deposits, and automated commission splits.
- **M2.2 Notifications Engine:** Integrate Twilio and SendGrid for automated SMS and Email reminders to reduce no-shows.
- **M2.3 Advanced Scheduling:** Support for staff-specific schedules, buffer times between appointments, and recurring bookings.
- **M2.4 Reviews & Ratings:** Allow verified users to leave reviews post-appointment.
- **M2.5 Business Analytics:** Dashboard charts for revenue tracking, popular services, and staff utilization.

*Deliverable:* Platform is ready to onboard actual paying businesses and process real transactions.

## Phase 3: Growth & Retention (Months 7-9) - "Scaling the Network"
**Goal:** Introduce features that drive user retention, increase booking frequency, and attract larger businesses.

### Milestones
- **M3.1 Native Mobile Apps:** Package the frontend using React Native or Capacitor for iOS and Android app stores.
- **M3.2 Marketing Tools:** Allow businesses to create promo codes, flash sales, and send bulk emails to past clients.
- **M3.3 Loyalty & Referrals:** Implement point systems for customers and referral bonuses to drive organic user acquisition.
- **M3.4 Real-Time Chat:** In-app messaging between customers and businesses (e.g., "I'm running 5 mins late").
- **M3.5 Multi-Location Support:** Enterprise dashboard for franchise owners to manage multiple branches from a single account.

## Phase 4: AI & Optimization (Months 10-12+) - "The Smart Marketplace"
**Goal:** Differentiate from competitors by using AI to optimize scheduling and personalize discovery.

### Milestones
- **M4.1 Smart Scheduling (AI):** Algorithm to suggest optimal booking times to minimize "swiss cheese" calendars (small unbookable gaps between appointments).
- **M4.2 Personalized Recommendations (AI):** "Because you booked a massage, try this nearby yoga studio" based on user behavior clustering.
- **M4.3 Dynamic Pricing:** Yield management features allowing businesses to automatically drop prices for hard-to-fill slots (e.g., Tuesday mornings).
- **M4.4 Global Expansion:** Multi-currency support, advanced localization (i18n), and horizontal expansion into Restaurants and Healthcare verticals.
