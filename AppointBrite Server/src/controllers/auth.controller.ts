/**
 * Auth Controller — handles HTTP requests for auth routes.
 */
import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { env } from '../config/env';

const setAuthCookies = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export class AuthController {
  async register(req: Request, res: Response) {
    const { 
      firstName, lastName, email, password, role, 
      phoneNumber, dateOfBirth, gender, address, preferences, timezone 
    } = req.body as any;

    const { refreshToken, ...result } = await authService.register({
      firstName,
      lastName,
      email,
      passwordHash: password, // mapped to plain text here, hashed in service
      role,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      preferences,
      timezone
    });

    setAuthCookies(res, refreshToken);
    sendSuccess(res, result, 'Registration successful', 201);
  }

  async login(req: Request, res: Response) {
    const { email, password, portal } = req.body as any;
    
    // Customer portal allows CUSTOMER. Business portal allows BUSINESS_OWNER & STAFF.
    let expectedRoles: string[] | undefined;
    if (portal === 'BUSINESS') {
      expectedRoles = ['BUSINESS_OWNER', 'STAFF'];
    } else if (portal === 'CUSTOMER') {
      expectedRoles = ['CUSTOMER'];
    }

    const { refreshToken, ...result } = await authService.login(email, password, expectedRoles);

    setAuthCookies(res, refreshToken);
    sendSuccess(res, result, 'Login successful');
  }

  async getMe(req: Request, res: Response) {
    // req.user is set by auth middleware
    sendSuccess(res, req.user);
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logout successful');
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token found' });
    }

    const { refreshToken: newRefreshToken, ...result } = await authService.refresh(refreshToken);
    
    setAuthCookies(res, newRefreshToken);
    sendSuccess(res, result, 'Token refreshed');
  }
}

export const authController = new AuthController();
