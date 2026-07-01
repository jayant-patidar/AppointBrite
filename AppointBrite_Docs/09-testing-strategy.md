# Document 09 — Testing Strategy (v1.0)
**Project Name:** AppointBrite

## 1. Testing Philosophy
AppointBrite handles sensitive user data and real financial transactions. Therefore, a robust testing strategy is non-negotiable. We follow the "Testing Pyramid" approach: many unit tests, fewer integration tests, and a small but critical suite of End-to-End (E2E) tests.

## 2. Unit Testing
**Scope:** Individual functions, hooks, and isolated UI components.
**Tools:** 
- Frontend: Jest + React Testing Library.
- Backend: Jest.

**Key Focus Areas:**
- **Availability Logic:** The algorithm that calculates available time slots based on business hours, buffer times, and existing bookings must have 100% test coverage.
- **Data Validation:** Zod schemas must be tested against both valid and intentionally malformed payloads.
- **UI Components:** Complex components (like the Calendar grid) should be tested for correct rendering states.

## 3. Integration Testing
**Scope:** Interactions between the database, services, and API endpoints.
**Tools:** Supertest + Jest (Backend).

**Key Focus Areas:**
- **Booking Flow:** Creating a booking must correctly update the database, deduct inventory, and trigger notification jobs.
- **Auth Flow:** Testing JWT generation, validation, and role-based access control (RBAC).

## 4. End-to-End (E2E) Testing
**Scope:** Full user journeys simulating real browser interactions against a staging environment.
**Tools:** Cypress or Playwright.

**Critical Paths to Cover:**
1. User logs in, searches for a salon, selects a slot, books, and sees the confirmation.
2. Business Owner logs in, views the dashboard, accepts a pending booking, and updates their profile.
3. Super Admin logs in and suspends a business account.

## 5. Continuous Integration (CI)
- All Pull Requests to the `main` or `develop` branches must pass the automated test suite via GitHub Actions.
- Code coverage is monitored. PRs that drop overall coverage below 80% will be blocked.
- E2E tests are run nightly against the `staging` environment.
