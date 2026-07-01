# Document 07 — Coding Standards (v1.0)
**Project Name:** AppointBrite

## 1. Core Principles

- **Readability over Cleverness:** Code is read 10x more often than it is written. Optimize for readability.
- **Strict Typing:** We use TypeScript heavily. Avoid `any`. Use `unknown` if a type is truly dynamic, and narrow it via type guards.
- **DRY (Don't Repeat Yourself) pragmatically:** Avoid duplicating complex business logic, but don't prematurely abstract simple UI components if they might diverge in the future.

## 2. General Tooling
- **Formatter:** Prettier (integrated into IDE and pre-commit hooks).
- **Linter:** ESLint (strict configuration).
- **Git Hooks:** Husky + lint-staged to prevent committing unformatted/lint-failing code.

## 3. Frontend Standards (React/TypeScript)

### Folder Structure (Feature-Based)
We organize code by feature rather than file type to keep related logic together.
```
src/
├── features/
│   ├── auth/          # Auth components, api calls, hooks, state
│   ├── booking/       # Booking wizard, calendar UI, hooks
│   ├── business/      # Profile display, reviews
│   └── dashboard/     # Business owner analytics and CRM
├── components/        # Global shared UI components (Buttons, Modals)
├── hooks/             # Global hooks (useAuth, useWindowSize)
├── utils/             # Helper functions (date formatting, currency)
├── types/             # Global TypeScript interfaces
└── App.tsx
```

### React Best Practices
- **Functional Components:** Only use functional components with Hooks. No Class components.
- **Component Size:** Break down components larger than 200 lines.
- **Data Fetching:** Use **React Query** (`useQuery`, `useMutation`) for all server state. Do not use `useEffect` for data fetching.
- **State Management:** 
  - Use React standard state (`useState`, `useReducer`) for local component state.
  - Use Redux Toolkit only for truly global state (e.g., current user session).
- **Props:** Destructure props in the function signature.

## 4. Backend Standards (Node.js/Express)

### Folder Structure (Layered Architecture)
```
src/
├── controllers/       # Handles HTTP requests/responses, extracts params
├── services/          # Core business logic (called by controllers)
├── models/            # Mongoose schemas and interfaces
├── routes/            # Express router definitions
├── middlewares/       # Auth guards, error handlers, request validation
├── utils/             # Loggers, hashers
└── server.ts          # Express setup and DB connection
```

### Backend Best Practices
- **Fat Services, Skinny Controllers:** Controllers should only handle HTTP req/res formatting. All business logic (e.g., checking if a time slot is free) lives in the `services/` layer.
- **Validation:** Use **Zod** in middleware to validate incoming request bodies and query parameters before they hit the controller.
- **Error Handling:** Never use `console.error` in production. Use a centralized error handling middleware and a logger (e.g., Winston or Pino). Throw custom API Error classes (e.g., `NotFoundError`, `UnauthorizedError`) in services.
- **Async/Await:** Use `async/await`. Avoid raw Promises (`.then().catch()`) to prevent callback hell.

## 5. Naming Conventions
- **Variables/Functions:** `camelCase` (e.g., `calculateTotal()`).
- **React Components/Interfaces:** `PascalCase` (e.g., `BookingModal`, `UserInterface`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_BOOKING_DAYS = 30`).
- **Files/Folders:** `kebab-case` for standard files (e.g., `user-service.ts`), `PascalCase` for React components (e.g., `BookingWizard.tsx`).

## 6. Commit Messages (Conventional Commits)
Format: `type(scope?): subject`
Examples:
- `feat(booking): add time slot selection UI`
- `fix(auth): resolve JWT expiration crash`
- `chore(deps): update react-router`
