import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user
  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    // Check whether the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    // Return user details without password
    return {
      message: 'Registration successful',
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Login an existing user
  async login(data: {
    email: string;
    password: string;
  }) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // Check whether the user exists and has a password
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare submitted password with stored hash
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    // Return user details without password
    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}