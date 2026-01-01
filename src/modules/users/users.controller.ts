/**
 * Users Controller Module
 * @description Handles HTTP requests for user management operations with caching
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { Request, Response } from "express";
import { cache } from "@/application/redis";
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@/lib/http-status-codes";
import {
    INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_PHRASE,
    NOT_FOUND as NOT_FOUND_PHRASE,
} from "@/lib/http-status-phrases";
import * as userService from "@/modules/users/users.service";
import type { CreateUserBody, ListQuery, UpdateUserBody, UserIdParam } from "@/modules/users/users.validation";

/**
 * Get all users with pagination
 * @description Retrieves paginated list of users with Redis caching
 * @param {Request} req - Express request object with validated query params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with users data and pagination metadata
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export async function index(req: Request, res: Response) {
    try {
        const { page = 1, per_page = 10 } = (req.validated?.query as ListQuery) ?? {};
        const cacheKey = `users:list:${page}:${per_page}`;

        // Try get from cache
        const cached = await cache.get<Awaited<ReturnType<typeof userService.getAllUsers>>>(cacheKey);

        if (cached) {
            return res.json({
                ...cached,
                cached: true,
            });
        }

        // Get users from database with pagination
        const result = await userService.getAllUsers({ page, per_page });

        // Cache for 5 minutes
        await cache.set(cacheKey, result, 300);

        res.json({
            ...result,
            cached: false,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_PHRASE,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

/**
 * Get user by ID
 * @description Retrieves a single user by their unique identifier
 * @param {Request} req - Express request object with user ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with user data or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export async function show(req: Request, res: Response) {
    try {
        const { id } = req.validated?.params as UserIdParam;

        const user = await userService.findUserById(id);

        if (!user) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: NOT_FOUND_PHRASE,
                errors: [
                    {
                        method: req.method,
                        path: req.originalUrl ?? req.path,
                        message: `User with id ${id} not found`,
                    },
                ],
            });
        }

        res.json({
            data: user,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_PHRASE,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

/**
 * Create new user
 * @description Creates a new user with unique email validation and cache invalidation
 * @param {Request} req - Express request object with validated user data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with created user data or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export async function store(req: Request, res: Response) {
    try {
        const data = req.validated?.body as CreateUserBody;

        // Check if email already exists
        const existingUser = await userService.findUserByEmail(data.email);

        if (existingUser) {
            return res.status(CONFLICT).json({
                message: "Email already exists",
            });
        }

        const user = await userService.createUser({
            ...data,
            email_verified_at: data.email_verified_at ? new Date(data.email_verified_at) : null,
        });

        // Clear cache
        await cache.delPattern("users:list:*");

        res.status(CREATED).json({
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_PHRASE,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

/**
 * Update user by ID
 * @description Updates user information with existence and unique email validation
 * @param {Request} req - Express request object with user ID in params and validated update data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with updated user data or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export async function update(req: Request, res: Response) {
    try {
        const { id } = req.validated?.params as UserIdParam;
        const data = req.validated?.body as UpdateUserBody;

        // Check if user exists
        const existingUser = await userService.findUserById(id);

        if (!existingUser) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: NOT_FOUND_PHRASE,
                errors: [
                    {
                        method: req.method,
                        path: req.originalUrl ?? req.path,
                        message: `User with id ${id} not found`,
                    },
                ],
            });
        }

        // Check if email already exists (if updating email)
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await userService.findUserByEmail(data.email);
            if (emailExists) {
                return res.status(CONFLICT).json({
                    message: "Email already exists",
                });
            }
        }

        const user = await userService.updateUser(id, {
            ...data,
            email_verified_at: data.email_verified_at ? new Date(data.email_verified_at) : undefined,
        });

        // Clear cache
        await cache.delPattern("users:list:*");

        res.json({
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_PHRASE,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

/**
 * Delete user by ID
 * @description Deletes a user with existence validation and cache invalidation
 * @param {Request} req - Express request object with user ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with deleted user data or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export async function destroy(req: Request, res: Response) {
    try {
        const { id } = req.validated?.params as UserIdParam;

        // Check if user exists
        const existingUser = await userService.findUserById(id);

        if (!existingUser) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: NOT_FOUND_PHRASE,
                errors: [
                    {
                        method: req.method,
                        path: req.originalUrl ?? req.path,
                        message: `User with id ${id} not found`,
                    },
                ],
            });
        }

        const user = await userService.deleteUser(id);

        // Clear cache
        await cache.delPattern("users:list:*");

        res.json({
            message: "User deleted successfully",
            data: user,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: INTERNAL_SERVER_ERROR_PHRASE,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
