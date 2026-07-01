/**
 * server.ts — Express app init, DB connection, Socket.IO setup.
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import connectDB from './config/database';
import { setupSocket } from './config/socket';
import { logger } from './config/logger';
import { env } from './config/env';
import { apiRouter } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';

const app = express();
const httpServer = createServer(app);

// ── Global Middleware ──
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

// ── API Routes ──
app.use('/api/v1', apiRouter);

// ── Error Handling ──
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ── Socket.IO ──
setupSocket(httpServer);

// ── Start Server ──
async function startServer() {
  try {
    await connectDB();
    httpServer.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
