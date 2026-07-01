/**
 * Socket.IO connection manager singleton.
 */
import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';

class SocketManager {
  private socket: Socket | null = null;

  connect(token: string, namespace = '/dashboard'): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${env.SOCKET_URL}${namespace}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketManager = new SocketManager();
