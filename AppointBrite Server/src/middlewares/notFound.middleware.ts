/**
 * 404 Not Found middleware.
 */
import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}
