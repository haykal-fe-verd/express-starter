/**
 * Auth Validation Module
 * @description Zod validation schemas for authentication operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import z from "zod";

//! ========== Request Schemas ==========

/**
 * Register validation schema
 * @description Schema for user registration with name, email, and password validation
 */
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name must not exceed 255 characters")
        .meta({ description: "User's full name", example: "John Doe" }),
    email: z
        .string()
        .email("Invalid email format")
        .max(255, "Email must not exceed 255 characters")
        .meta({ description: "User's email address", example: "john.doe@example.com" }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .meta({
            description: "User's password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)",
            example: "SecurePass123",
        }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login validation schema
 * @description Schema for user login with email and password
 */
export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email format")
        .meta({ description: "User's email address", example: "john.doe@example.com" }),
    password: z
        .string()
        .min(1, "Password is required")
        .meta({ description: "User's password", example: "SecurePass123" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Refresh token validation schema
 * @description Schema for refreshing access token using refresh token
 */
export const refreshTokenSchema = z.object({
    refresh_token: z
        .string()
        .min(1, "Refresh token is required")
        .meta({ description: "JWT refresh token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

//! ========== Response Schemas ==========

/**
 * User schema for responses
 * @description User object structure returned in auth responses
 */
export const userSchema = z.object({
    id: z
        .string()
        .uuid()
        .meta({ description: "User's unique identifier", example: "550e8400-e29b-41d4-a716-446655440000" }),
    name: z.string().meta({ description: "User's full name", example: "John Doe" }),
    email: z.string().email().meta({ description: "User's email address", example: "john.doe@example.com" }),
    email_verified_at: z
        .string()
        .datetime()
        .nullable()
        .meta({ description: "Email verification timestamp", example: "2026-01-01T10:00:00Z" }),
    created_at: z
        .string()
        .datetime()
        .meta({ description: "Account creation timestamp", example: "2026-01-01T08:00:00Z" }),
    updated_at: z.string().datetime().meta({ description: "Last update timestamp", example: "2026-01-01T09:30:00Z" }),
});

/**
 * Register response schema
 * @description Response structure for successful user registration
 */
export const registerResponseSchema = z.object({
    success: z.literal(true).meta({ description: "Response status", example: true }),
    message: z.string().meta({ description: "Success message", example: "User registered successfully" }),
    data: z
        .object({
            access_token: z
                .string()
                .meta({ description: "JWT access token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
            refresh_token: z
                .string()
                .meta({ description: "JWT refresh token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
            user: userSchema.meta({ description: "Registered user object" }),
        })
        .meta({ description: "Registration data with tokens and user info" }),
});

/**
 * Login response schema
 * @description Response structure for successful user login
 */
export const loginResponseSchema = z.object({
    success: z.literal(true).meta({ description: "Response status", example: true }),
    message: z.string().meta({ description: "Success message", example: "Login successful" }),
    data: z
        .object({
            access_token: z
                .string()
                .meta({ description: "JWT access token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
            refresh_token: z
                .string()
                .meta({ description: "JWT refresh token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
            user: userSchema.meta({ description: "Authenticated user object" }),
        })
        .meta({ description: "Login data with tokens and user info" }),
});

/**
 * Refresh token response schema
 * @description Response structure for successful token refresh
 */
export const refreshTokenResponseSchema = z.object({
    success: z.literal(true).meta({ description: "Response status", example: true }),
    message: z.string().meta({ description: "Success message", example: "Token refreshed successfully" }),
    data: z
        .object({
            access_token: z
                .string()
                .meta({ description: "New JWT access token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
        })
        .meta({ description: "New access token" }),
});

/**
 * Profile response schema
 * @description Response structure for user profile retrieval
 */
export const profileResponseSchema = z.object({
    success: z.literal(true).meta({ description: "Response status", example: true }),
    message: z.string().meta({ description: "Success message", example: "Profile retrieved successfully" }),
    data: userSchema.meta({ description: "User profile object" }),
});
