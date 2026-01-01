/**
 * Users Validation Module
 * @description Zod validation schemas for user management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { z } from "zod";

//! ========== Request Schemas ==========

/**
 * List query schema
 * @description Pagination parameters for user listing
 */
export const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1).meta({ description: "Page number for pagination", example: 1 }),
    per_page: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .meta({ description: "Number of items per page", example: 10 }),
});

/**
 * User ID parameter schema
 * @description UUID validation for user ID in route parameters
 */
export const userIdParamSchema = z.object({
    id: z
        .string()
        .uuid()
        .meta({ description: "Unique identifier of the user", example: "550e8400-e29b-41d4-a716-446655440000" }),
});

/**
 * Create user schema
 * @description Validation schema for creating a new user
 */
export const createUserSchema = z.object({
    name: z.string().min(1).max(255).meta({ description: "User's full name", example: "John Doe" }),
    email: z.string().email().max(255).meta({ description: "User's email address", example: "john.doe@example.com" }),
    password: z
        .string()
        .min(6)
        .max(255)
        .meta({ description: "User's password (minimum 6 characters)", example: "securePassword123" }),
    email_verified_at: z
        .string()
        .datetime()
        .optional()
        .meta({ description: "Email verification timestamp", example: "2026-01-01T10:00:00Z" }),
    remember_token: z
        .string()
        .max(100)
        .optional()
        .meta({ description: "Remember token for session", example: "abc123token" }),
});

/**
 * Update user schema
 * @description Validation schema for updating an existing user
 */
export const updateUserSchema = z.object({
    name: z.string().min(1).max(255).optional().meta({ description: "User's full name", example: "John Doe" }),
    email: z
        .string()
        .email()
        .max(255)
        .optional()
        .meta({ description: "User's email address", example: "john.doe@example.com" }),
    password: z
        .string()
        .min(6)
        .max(255)
        .optional()
        .meta({ description: "User's password (minimum 6 characters)", example: "newSecurePassword123" }),
    email_verified_at: z
        .string()
        .datetime()
        .optional()
        .meta({ description: "Email verification timestamp", example: "2026-01-01T10:00:00Z" }),
    remember_token: z
        .string()
        .max(100)
        .optional()
        .meta({ description: "Remember token for session", example: "xyz789token" }),
});

//! ========== Response Schemas ==========

/**
 * User schema
 * @description User object structure for responses
 */
export const userSchema = z.object({
    id: z
        .string()
        .uuid()
        .meta({ description: "Unique identifier of the user", example: "550e8400-e29b-41d4-a716-446655440000" }),
    name: z.string().meta({ description: "User's full name", example: "John Doe" }),
    email: z.string().email().meta({ description: "User's email address", example: "john.doe@example.com" }),
    email_verified_at: z
        .string()
        .datetime()
        .nullable()
        .meta({ description: "Email verification timestamp", example: "2026-01-01T10:00:00Z" }),
    created_at: z.string().datetime().meta({ description: "User creation timestamp", example: "2026-01-01T08:00:00Z" }),
    updated_at: z.string().datetime().meta({ description: "Last update timestamp", example: "2026-01-01T09:30:00Z" }),
});

/**
 * Pagination metadata schema
 * @description Pagination information for list responses
 */
export const paginationMetaSchema = z.object({
    total: z.number().meta({ description: "Total number of items", example: 100 }),
    page: z.number().meta({ description: "Current page number", example: 1 }),
    per_page: z.number().meta({ description: "Number of items per page", example: 10 }),
    total_pages: z.number().meta({ description: "Total number of pages", example: 10 }),
    has_next_page: z.boolean().meta({ description: "Whether there is a next page", example: true }),
    has_prev_page: z.boolean().meta({ description: "Whether there is a previous page", example: false }),
});

export const userListResponseSchema = z.object({
    status: z.literal("success").meta({ description: "Response status", example: "success" }),
    data: z.array(userSchema).meta({ description: "Array of user objects" }),
    meta: paginationMetaSchema.meta({ description: "Pagination metadata" }),
});

export const userDetailResponseSchema = z.object({
    status: z.literal("success").meta({ description: "Response status", example: "success" }),
    data: userSchema.meta({ description: "User object" }),
});

export const userCreatedResponseSchema = z.object({
    status: z.literal("success").meta({ description: "Response status", example: "success" }),
    message: z.string().meta({ description: "Success message", example: "User created successfully" }),
    data: userSchema.meta({ description: "Created user object" }),
});

//! ========== Types ==========
export type PaginationMeta = {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type GetAllUsersParams = {
    page?: number;
    per_page?: number;
};

export type ListQuery = z.infer<typeof listQuerySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>;
