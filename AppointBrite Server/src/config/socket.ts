/**
 * Socket.IO server setup (per Doc 05 — WebSocket Events).
 */
import { Server as SocketIOServer } from 'socket.io';
import type { Server } from 'http';
import { env } from './env';
import { logger } from './logger';

let io: SocketIOServer;

export function setupSocket(httpServer: Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Dashboard namespace for real-time booking events
  const dashboard = io.of('/dashboard');

  dashboard.on('connection', (socket) => {
    logger.info(`[Socket] Client connected: ${socket.id}`);

    socket.on('joinRoom', ({ businessId }: { businessId: string }) => {
      socket.join(`business:${businessId}`);
      logger.info(`[Socket] ${socket.id} joined room business:${businessId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket] Client disconnected: ${socket.id} - ${reason}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call setupSocket() first.');
  }
  return io;
}
