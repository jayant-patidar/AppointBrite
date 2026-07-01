/**
 * Standardized API response builder (per Doc 05).
 */
import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number },
  message?: string,
) {
  return res.status(200).json({
    success: true,
    data,
    pagination,
    message,
  });
}
