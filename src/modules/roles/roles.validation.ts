/**
 * Roles Validation Module
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import z from "zod";

/**
 * Permission schema for nested objects
 */
const permissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});

/**
 * Single role data schema
 */
const roleDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    permissions: z.array(permissionSchema).optional(),
    users_count: z.number().optional(),
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
 * Role list response schema
 * @typedef {Object} RoleListResponse
 */
export const roleListResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(roleDataSchema),
    meta: paginationMetaSchema,
});

/**
 * Role detail response schema
 * @typedef {Object} RoleDetailResponse
 */
export const roleDetailResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: roleDataSchema.nullable(),
});

/**
 * Role created response schema
 * @typedef {Object} RoleCreatedResponse
 */
export const roleCreatedResponseSchema = z.object({
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
 * Create role validation schema
 * @typedef {Object} CreateRoleInput
 * @property {string} name - Role name (2-100 characters)
 * @property {string} [description] - Role description (optional)
 */
export const createRoleSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    description: z.string().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

/**
 * Update role validation schema
 * @typedef {Object} UpdateRoleInput
 * @property {string} [name] - Role name (2-100 characters, optional)
 * @property {string} [description] - Role description (optional)
 */
export const updateRoleSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),
    description: z.string().optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

/**
 * Role ID parameter validation schema
 * @typedef {Object} RoleIdParam
 * @property {string} id - UUID of the role
 */
export const roleIdParamSchema = z.object({
    id: z.string().uuid("Invalid role ID format"),
});

/**
 * Assign permissions to role validation schema
 * @typedef {Object} AssignPermissionsInput
 * @property {string[]} permission_ids - Array of permission UUIDs
 */
export const assignPermissionsSchema = z.object({
    permission_ids: z.array(z.string().uuid("Invalid permission ID")).min(1, "At least one permission required"),
});

export type AssignPermissionsInput = z.infer<typeof assignPermissionsSchema>;

/**
 * List query validation schema
 * @typedef {Object} GetAllRolesParams
 * @property {number} [page=1] - Page number (positive integer)
 * @property {number} [per_page=10] - Items per page (1-100)
 */
export const listQuerySchema = z.object({
    page: z.coerce.number().positive().default(1),
    per_page: z.coerce.number().positive().max(100).default(10),
});

export type GetAllRolesParams = z.infer<typeof listQuerySchema>;
