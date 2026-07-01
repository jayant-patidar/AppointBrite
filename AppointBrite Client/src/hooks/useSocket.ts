/**
 * Socket.IO connection hook.
 */
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { useAuth } from './useAuth';

export function useSocket(namespace = '/dashboard') {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io(`${env.SOCKET_URL}${namespace}`, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken, namespace]);

  return socketRef.current;
}
