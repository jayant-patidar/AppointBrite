/**
 * Auth Service — handles registration, login, and token generation.
 */
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/user.model';
import { env } from '../config/env';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ConflictError } from '../errors/ConflictError';

export class AuthService {
  private generateTokens(user: IUser) {
    const payload = { userId: user._id.toString(), role: user.role };
    
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as any });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as any });

    return { accessToken, refreshToken };
  }

  async register(data: Partial<IUser>) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = await hashPassword(data.passwordHash!); // passwordHash comes in as plaintext password from controller

    const user = await User.create({
      ...data,
      passwordHash: hashedPassword,
    });

    const tokens = this.generateTokens(user);

    // Don't send password hash back
    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    return { user: userResponse, ...tokens };
  }

  async login(email: string, passwordPlain: string, expectedRoles?: string[]) {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (expectedRoles && !expectedRoles.includes(user.role)) {
      throw new UnauthorizedError(`You are registered as a ${user.role}. Please log in via the correct tab.`);
    }

    const isMatch = await comparePassword(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user);

    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    return { user: userResponse, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
      const user = await User.findById(decoded.userId);
      if (!user) throw new UnauthorizedError('User no longer exists');

      const tokens = this.generateTokens(user);
      const userResponse = user.toObject();
      delete (userResponse as any).passwordHash;

      return { user: userResponse, ...tokens };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    
    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;
    return userResponse;
  }
}

export const authService = new AuthService();
