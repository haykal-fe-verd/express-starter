/**
 * Permissions Service Module
 * @description Business logic for permission management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { prisma } from "@/application/database";
import type {
    CreatePermissionInput,
    GetAllPermissionsParams,
    UpdatePermissionInput,
} from "@/modules/permissions/permissions.validation";

/**
 * Get all permissions with pagination
 * @description Retrieves a paginated list of permissions with their role count
 * @param {GetAllPermissionsParams} params - Pagination parameters (page, per_page)
 * @returns {Promise<{data: Array, meta: Object}>} Paginated permissions data with metadata
 * @throws {Error} If database operation fails
 */
export const getAllPermissions = async (params: GetAllPermissionsParams = { page: 1, per_page: 10 }) => {
    const page = params.page || 1;
    const per_page = params.per_page || 10;
    const skip = (page - 1) * per_page;

    const total = await prisma.permission.count();

    const permissions = await prisma.permission.findMany({
        skip,
        take: per_page,
        orderBy: { created_at: "desc" },
        include: {
            _count: {
                select: {
                    role_permissions: true,
                },
            },
        },
    });

    const total_pages = Math.ceil(total / per_page);

    return {
        data: permissions.map((permission) => ({
            id: permission.id,
            name: permission.name,
            description: permission.description,
            roles_count: permission._count.role_permissions,
            created_at: permission.created_at,
            updated_at: permission.updated_at,
        })),
        meta: {
            page,
            per_page,
            total,
            total_pages,
            has_next_page: page < total_pages,
            has_prev_page: page > 1,
        },
    };
};

/**
 * Get permission by ID
 * @description Retrieves a single permission with associated roles
 * @param {string} id - UUID of the permission
 * @returns {Promise<Object>} Permission data with associated roles
 * @throws {Error} If permission not found or database operation fails
 */
export const getPermissionById = async (id: string) => {
    const permission = await prisma.permission.findUnique({
        where: { id },
        include: {
            role_permissions: {
                include: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            },
        },
    });

    if (!permission) {
        throw new Error("Permission not found");
    }

    return {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        roles: permission.role_permissions.map((rp) => rp.role),
        created_at: permission.created_at,
        updated_at: permission.updated_at,
    };
};

/**
 * Create permission
 * @description Creates a new permission with unique name
 * @param {CreatePermissionInput} data - Permission creation data (name, description)
 * @returns {Promise<Object>} Created permission data
 * @throws {Error} If permission name already exists or database operation fails
 */
export const createPermission = async (data: CreatePermissionInput) => {
    const existingPermission = await prisma.permission.findUnique({
        where: { name: data.name },
    });

    if (existingPermission) {
        throw new Error("Permission with this name already exists");
    }

    const permission = await prisma.permission.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });

    return permission;
};

/**
 * Update permission
 * @description Updates an existing permission's information
 * @param {string} id - UUID of the permission to update
 * @param {UpdatePermissionInput} data - Updated permission data (name, description)
 * @returns {Promise<Object>} Updated permission data
 * @throws {Error} If permission not found, name already exists, or database operation fails
 */
export const updatePermission = async (id: string, data: UpdatePermissionInput) => {
    const permission = await prisma.permission.findUnique({ where: { id } });

    if (!permission) {
        throw new Error("Permission not found");
    }

    if (data.name) {
        const existingPermission = await prisma.permission.findFirst({
            where: {
                name: data.name,
                id: { not: id },
            },
        });

        if (existingPermission) {
            throw new Error("Permission with this name already exists");
        }
    }

    const updatedPermission = await prisma.permission.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
        },
    });

    return updatedPermission;
};

/**
 * Delete permission
 * @description Deletes a permission and cascades to role_permissions
 * @param {string} id - UUID of the permission to delete
 * @returns {Promise<Object>} Deleted permission data
 * @throws {Error} If permission not found or database operation fails
 */
export const deletePermission = async (id: string) => {
    const permission = await prisma.permission.findUnique({ where: { id } });

    if (!permission) {
        throw new Error("Permission not found");
    }

    await prisma.permission.delete({ where: { id } });

    return permission;
};
