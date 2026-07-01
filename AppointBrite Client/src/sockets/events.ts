/**
 * Socket.IO event name constants (per Doc 05 — WebSocket Events).
 */
export const SOCKET_EVENTS = {
  // Client emits
  JOIN_ROOM: 'joinRoom',

  // Server emits
  NEW_BOOKING: 'NEW_BOOKING',
  BOOKING_CANCELED: 'BOOKING_CANCELED',
  STATUS_UPDATED: 'STATUS_UPDATED',
} as const;
