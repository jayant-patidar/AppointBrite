# AppointBrite

> The "Uber Eats for appointments" — A two-sided marketplace platform for discovering, comparing, and booking real-time appointments with local service-based businesses.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, MUI v6, Redux Toolkit, React Query |
| Backend | Node.js, Express 4, TypeScript, Mongoose |
| Database | MongoDB (Atlas) |
| Cache/Queue | Redis, BullMQ |
| Real-Time | Socket.IO |
| Auth | JWT (access + refresh tokens) |

## Project Structure

```
AppointBrite/
├── package.json              # npm workspaces root
├── AppointBrite_Docs/        # Product & technical documentation
├── AppointBrite Client/      # React + Vite + TypeScript SPA
└── AppointBrite Server/      # Node.js + Express + TypeScript API
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Installation
```bash
# Install all dependencies (both client and server)
npm install

# Copy environment files
cp "AppointBrite Client/.env.example" "AppointBrite Client/.env"
cp "AppointBrite Server/.env.example" "AppointBrite Server/.env"
```

### Development
```bash
# Start client dev server
npm run dev:client

# Start server dev server
npm run dev:server

# Or run both (in separate terminals)
```

### Build
```bash
# Build both client and server
npm run build
```

## Documentation

See the [AppointBrite_Docs/](./AppointBrite_Docs/) folder for complete product and technical documentation.

## License

Private — All rights reserved.
