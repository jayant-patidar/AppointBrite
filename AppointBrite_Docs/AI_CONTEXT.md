# AI Project Context (AI_CONTEXT.md)
**Project Name:** AppointBrite
**Role:** Master Context file for AI Coding Assistants (Cursor, Windsurf, Copilot, etc.)

## Introduction to the AI Assistant
You are an AI assisting in the development of **AppointBrite**, a two-sided marketplace for booking local services (like Uber Eats, but for appointments). 

Your goal is to ensure architectural consistency, follow the defined coding standards, and build features exactly as specified in the supporting documentation.

## How to use this workspace
This directory (`docs/`) contains the complete blueprint for the startup. Before implementing a new feature, you must read the relevant documents below to understand the business rules, database schema, and API contracts.

## Index of Supporting Documents

### Business & Product
- **[00-project-vision.md](./00-project-vision.md):** The core problem we are solving and target audience.
- **[01-business-model.md](./01-business-model.md):** How the platform makes money and phases of rollout.
- **[02-product-requirements.md](./02-product-requirements.md):** User journeys and specific feature lists for Customers, Businesses, and Admins.

### Technical Architecture
- **[03-system-architecture.md](./03-system-architecture.md):** MERN Stack details, Cloud infrastructure (AWS), and real-time sockets.
- **[04-database-design.md](./04-database-design.md):** MongoDB schema designs (`users`, `businesses`, `bookings`, `services`). **Crucial for data modeling.**
- **[05-api-specification.md](./05-api-specification.md):** REST API design principles and core endpoints.

### Development Guidelines
- **[06-ui-ux-guidelines.md](./06-ui-ux-guidelines.md):** Material UI usage, color palette, and progressive disclosure principles.
- **[07-coding-standards.md](./07-coding-standards.md):** React/TypeScript rules, React Query usage, and folder structure. **Crucial for code generation.**
- **[08-project-roadmap.md](./08-project-roadmap.md):** Phases of development. We are currently in Phase 1 (MVP).
- **[09-testing-strategy.md](./09-testing-strategy.md):** Unit and E2E testing requirements using Jest.
- **[10-deployment.md](./10-deployment.md):** CI/CD pipeline and environment variables context.

## Current State & Next Steps
We are currently building **Phase 1 (MVP)**. 
When asked to implement a feature, always verify if it belongs in the MVP scope (Document 08). If it's a Phase 2 or 3 feature, ask the user for confirmation before writing complex code.
