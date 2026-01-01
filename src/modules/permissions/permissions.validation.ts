/**
 * Permissions Validation Module
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import z from "zod";

/**
 * Role schema for nested objects
 */
const roleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});

/**
 * Single permission data schema
 */
const permissionDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    roles: z.array(roleSchema).optional(),
    roles_count: z.number().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

/**
 * Pagination meta schema
 */
const paginationMetaSchema = z.object({
    page: z.number(),
    per_page: z.number(),
    total: z.number(),
    total_pages: z.number(),
    has_next_page: z.boolean(),
    has_prev_page: z.boolean(),
});

/**
 * Permission list response schema
 * @typedef {Object} PermissionListResponse
 */
export const permissionListResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(permissionDataSchema),
    meta: paginationMetaSchema,
});

/**
 * Permission detail response schema
 * @typedef {Object} PermissionDetailResponse
 */
export const permissionDetailResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: permissionDataSchema.nullable(),
});

/**
 * Permission created response schema
 * @typedef {Object} PermissionCreatedResponse
 */
export const permissionCreatedResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z
        .object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            created_at: z.string(),
            updated_at: z.string(),
        })
        .nullable(),
});

/**
 * Create permission validation schema
 * @typedef {Object} CreatePermissionInput
 * @property {string} name - Permission name (2-100 characters)
 * @property {string} [description] - Permission description (optional)
 */
export const createPermissionSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    description: z.string().optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;

/**
 * Update permission validation schema
 * @typedef {Object} UpdatePermissionInput
 * @property {string} [name] - Permission name (2-100 characters, optional)
 * @property {string} [description] - Permission description (optional)
 */
export const updatePermissionSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),
    description: z.string().optional(),
});

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;

/**
 * Permission ID parameter validation schema
 * @typedef {Object} PermissionIdParam
 * @property {string} id - UUID of the permission
 */
export const permissionIdParamSchema = z.object({
    id: z.string().uuid("Invalid permission ID format"),
});

/**
 * List query validation schema
 * @typedef {Object} GetAllPermissionsParams
 * @property {number} [page=1] - Page number (positive integer)
 * @property {number} [per_page=10] - Items per page (1-100)
 */
export const listQuerySchema = z.object({
    page: z.coerce.number().positive().default(1),
    per_page: z.coerce.number().positive().max(100).default(10),
});

export type GetAllPermissionsParams = z.infer<typeof listQuerySchema>;
