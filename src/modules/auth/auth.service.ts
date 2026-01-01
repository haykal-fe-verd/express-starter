/**
 * Auth Service Module
 * @description Business logic for authentication operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import bcrypt from "bcrypt";
import { prisma } from "@/application/database";
import { generateTokenPair, type TokenPair, verifyRefreshToken } from "@/lib/jwt";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "@/modules/auth/auth.validation";

/**
 * Register a new user
 * @description Creates a new user account with hashed password and generates JWT tokens
 * @param {RegisterInput} data - User registration data (name, email, password)
 * @returns {Promise<TokenPair>} Access and refresh tokens for the new user
 * @throws {Error} If user with email already exists or database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const register = async (data: RegisterInput): Promise<TokenPair> => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });

    // Generate tokens
    const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
    });

    return tokens;
};

/**
 * Login user
 * @description Authenticates user with email and password, generates JWT tokens
 * @param {LoginInput} data - User login credentials (email, password)
 * @returns {Promise<TokenPair>} Access and refresh tokens for authenticated user
 * @throws {Error} If credentials are invalid or database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const login = async (data: LoginInput): Promise<TokenPair> => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }

    // Generate tokens
    const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
    });

    return tokens;
};

/**
 * Refresh access token
 * @description Generates new access token using valid refresh token
 * @param {RefreshTokenInput} data - Refresh token data
 * @returns {Promise<TokenPair>} New access and refresh tokens
 * @throws {Error} If refresh token is invalid/expired or user not found
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const refreshToken = async (data: RefreshTokenInput): Promise<TokenPair> => {
    // Verify refresh token
    const payload = verifyRefreshToken(data.refresh_token);

    if (!payload) {
        throw new Error("Invalid or expired refresh token");
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Generate new tokens
    const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
    });

    return tokens;
};

/**
 * Get authenticated user profile
 * @description Retrieves user profile information by user ID
 * @param {string} userId - UUID of the authenticated user
 * @returns {Promise<Object>} User profile data (id, name, email, email_verified_at, created_at, updated_at)
 * @throws {Error} If user not found or database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};
