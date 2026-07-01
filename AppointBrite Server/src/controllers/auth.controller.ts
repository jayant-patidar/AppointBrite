/**
 * Auth Controller — handles HTTP requests for auth routes.
 */
import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export class AuthController {
  async register(req: Request, res: Response) {
    const { firstName, lastName, email, password, role } = req.body as any;

    const result = await authService.register({
      firstName,
      lastName,
      email,
      passwordHash: password, // mapped to plain text here, hashed in service
      role,
    });

    sendSuccess(res, result, 'Registration successful', 201);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body as any;

    const result = await authService.login(email, password);

    sendSuccess(res, result, 'Login successful');
  }

  async getMe(req: Request, res: Response) {
    // req.user is set by auth middleware
    sendSuccess(res, req.user);
  }
}

export const authController = new AuthController();
