# Document 03 — System Architecture (v1.0)
**Project Name:** AppointBrite

## 1. High-Level Architecture

AppointBrite is built on a modern MERN (MongoDB, Express, React, Node.js) stack, utilizing a microservices-oriented monolithic approach (modular monolith) to balance early-stage development speed with future scalability.

### Core Components
- **Client Application (Web/Mobile Web):** React SPA (Single Page Application) built with Vite and TypeScript.
- **Backend API Server:** Node.js with Express and TypeScript, handling business logic and RESTful API endpoints.
- **Database Layer:** MongoDB for flexible, document-based data storage, ideal for varied business configurations.
- **Caching & Job Queue:** Redis for fast read access (e.g., search results) and background job processing (BullMQ) for notifications and reminders.
- **Real-Time Communication:** Socket.IO for pushing instant calendar updates to the business dashboard.

## 2. Component Details

### Frontend (Client)
- **Framework:** React 18+
- **Language:** TypeScript
- **State Management:** 
  - Redux Toolkit (Global state: Auth, User Session).
  - React Query (Server state: Fetching, caching, and synchronizing data like search results and availability).
- **Styling:** Material UI (MUI) v5 + Emotion (CSS-in-JS).
- **Routing:** React Router v6.
- **Form Handling:** React Hook Form + Zod (Validation).

### Backend (Server)
- **Framework:** Express.js 4.x
- **Language:** TypeScript
- **ORM/ODM:** Mongoose.
- **Authentication:** JWT (JSON Web Tokens) with short-lived access tokens and HttpOnly refresh tokens.
- **Real-Time:** Socket.IO for calendar events.
- **Task Queue:** BullMQ (backed by Redis) for scheduling SMS/Email reminders asynchronously.

### Database (MongoDB)
- **Why MongoDB?** The polymorphic nature of businesses (a restaurant has tables, a salon has stylists) requires flexible schema design. MongoDB handles this variance gracefully through embedded documents and flexible schema rules.

## 3. Infrastructure & Deployment Architecture

- **Cloud Provider:** AWS (Amazon Web Services).
- **Containerization:** Docker (Frontend, Backend, and Redis run in separate containers).
- **Hosting Strategy:**
  - **Frontend:** Deployed to AWS S3 and distributed globally via Cloudflare CDN.
  - **Backend:** AWS ECS (Elastic Container Service) with AWS Fargate (Serverless compute for containers). Auto-scaling configured based on CPU usage.
  - **Database:** MongoDB Atlas (managed service) for automated backups, scaling, and high availability.
- **Load Balancing:** AWS Application Load Balancer (ALB).
- **DNS & Security:** Cloudflare (WAF, DDoS protection, SSL).

## 4. Third-Party Integrations

- **Payments:** Stripe Connect (Handles complex multi-party payouts and commission splits).
- **Transactional Emails:** SendGrid or AWS SES.
- **SMS Notifications:** Twilio.
- **Geolocation/Mapping:** Google Maps API or Mapbox (for search radius and location display).
- **Image Storage:** AWS S3 (Business gallery, profile pictures).

## 5. System Flow Diagrams (Conceptual)

### Search & Booking Flow
1. Client (React) requests `GET /api/businesses/search?q=salon&lat=X&lng=Y`.
2. API hits Redis Cache. If miss, queries MongoDB (Geospatial index).
3. Client displays results. User selects business.
4. Client requests `GET /api/availability?businessId=123&date=YYYY-MM-DD`.
5. API queries MongoDB for existing appointments and calculates available slots based on business rules.
6. User confirms booking -> `POST /api/bookings`.
7. API creates booking -> Charges via Stripe -> Emits Socket.IO event to Business Dashboard -> Enqueues notification job in BullMQ.

## 6. Security Posture
- Rate limiting on sensitive endpoints (e.g., Auth).
- Data encryption at rest (MongoDB Atlas) and in transit (TLS 1.2+).
- CORS configuration strictly limited to allowed client domains.
- Input validation on all requests using Zod schemas on both frontend and backend.
