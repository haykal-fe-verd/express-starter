/**
 * Users Service Module
 * @description Business logic for user management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { prisma } from "@/application/database";
import type { Prisma } from "@/generated/prisma/client";
import type { GetAllUsersParams, PaginationMeta } from "@/modules/users/users.validation";

/**
 * Get all users with pagination
 * @description Retrieves paginated list of users with metadata
 * @param {GetAllUsersParams} params - Pagination parameters (page, per_page)
 * @returns {Promise<{data: Array, meta: PaginationMeta}>} Paginated users data with metadata
 * @throws {Error} If database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const getAllUsers = async (params: GetAllUsersParams = {}) => {
    const page = params.page || 1;
    const per_page = params.per_page || 10;
    const skip = (page - 1) * per_page;

    // Get total count
    const total = await prisma.user.count();

    // Get paginated users
    const users = await prisma.user.findMany({
        skip,
        take: per_page,
        orderBy: {
            created_at: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    // Calculate pagination metadata
    const total_pages = Math.ceil(total / per_page);
    const has_next_page = page < total_pages;
    const has_prev_page = page > 1;

    const meta: PaginationMeta = {
        total,
        page,
        per_page,
        total_pages,
        has_next_page,
        has_prev_page,
    };

    return {
        data: users,
        meta,
    };
};

/**
 * Find user by ID
 * @description Retrieves a single user by their unique identifier
 * @param {string} id - UUID of the user
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const findUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    return user;
};

/**
 * Find user by email
 * @description Retrieves a single user by their email address
 * @param {string} email - Email address of the user
 * @returns {Promise<Object|null>} User object or null if not found
 * @throws {Error} If database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    return user;
};

/**
 * Create new user
 * @description Creates a new user in the database
 * @param {Prisma.UserCreateInput} data - User creation data
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If database operation fails or validation error occurs
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const createUser = async (data: Prisma.UserCreateInput) => {
    const user = await prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    return user;
};

/**
 * Update user by ID
 * @description Updates an existing user's information
 * @param {string} id - UUID of the user to update
 * @param {Prisma.UserUpdateInput} data - Updated user data
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If user not found or database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    const user = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            email_verified_at: true,
            created_at: true,
            updated_at: true,
        },
    });

    return user;
};

/**
 * Delete user by ID
 * @description Deletes a user from the database
 * @param {string} id - UUID of the user to delete
 * @returns {Promise<Object>} Deleted user object
 * @throws {Error} If user not found or database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return user;
};
