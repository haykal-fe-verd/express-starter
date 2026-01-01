/**
 * Roles Service Module
 * @description Business logic for role management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { prisma } from "@/application/database";
import type {
    AssignPermissionsInput,
    CreateRoleInput,
    GetAllRolesParams,
    UpdateRoleInput,
} from "@/modules/roles/roles.validation";

/**
 * Get all roles with pagination
 * @description Retrieves a paginated list of roles with their permissions and user count
 * @param {GetAllRolesParams} params - Pagination parameters (page, per_page)
 * @returns {Promise<{data: Array, meta: Object}>} Paginated roles data with metadata
 * @throws {Error} If database operation fails
 */
export const getAllRoles = async (params: GetAllRolesParams = { page: 1, per_page: 10 }) => {
    const page = params.page || 1;
    const per_page = params.per_page || 10;
    const skip = (page - 1) * per_page;

    const total = await prisma.role.count();

    const roles = await prisma.role.findMany({
        skip,
        take: per_page,
        orderBy: { created_at: "desc" },
        include: {
            role_permissions: {
                include: {
                    permission: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    user_roles: true,
                },
            },
        },
    });

    const total_pages = Math.ceil(total / per_page);

    return {
        data: roles.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissions: role.role_permissions.map((rp) => rp.permission),
            users_count: role._count.user_roles,
            created_at: role.created_at,
            updated_at: role.updated_at,
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
 * Get role by ID
 * @description Retrieves a single role with its permissions and user count
 * @param {string} id - UUID of the role
 * @returns {Promise<Object>} Role data with permissions and user count
 * @throws {Error} If role not found or database operation fails
 */
export const getRoleById = async (id: string) => {
    const role = await prisma.role.findUnique({
        where: { id },
        include: {
            role_permissions: {
                include: {
                    permission: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    user_roles: true,
                },
            },
        },
    });

    if (!role) {
        throw new Error("Role not found");
    }

    return {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.role_permissions.map((rp) => rp.permission),
        users_count: role._count.user_roles,
        created_at: role.created_at,
        updated_at: role.updated_at,
    };
};

/**
 * Create role
 * @description Creates a new role with unique name
 * @param {CreateRoleInput} data - Role creation data (name, description)
 * @returns {Promise<Object>} Created role data
 * @throws {Error} If role name already exists or database operation fails
 */
export const createRole = async (data: CreateRoleInput) => {
    const existingRole = await prisma.role.findUnique({
        where: { name: data.name },
    });

    if (existingRole) {
        throw new Error("Role with this name already exists");
    }

    const role = await prisma.role.create({
        data: {
            name: data.name,
            description: data.description,
        },
    });

    return role;
};

/**
 * Update role
 * @description Updates an existing role's information
 * @param {string} id - UUID of the role to update
 * @param {UpdateRoleInput} data - Updated role data (name, description)
 * @returns {Promise<Object>} Updated role data
 * @throws {Error} If role not found, name already exists, or database operation fails
 */
export const updateRole = async (id: string, data: UpdateRoleInput) => {
    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
        throw new Error("Role not found");
    }

    if (data.name) {
        const existingRole = await prisma.role.findFirst({
            where: {
                name: data.name,
                id: { not: id },
            },
        });

        if (existingRole) {
            throw new Error("Role with this name already exists");
        }
    }

    const updatedRole = await prisma.role.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
        },
    });

    return updatedRole;
};

/**
 * Delete role
 * @description Deletes a role and cascades to user_roles and role_permissions
 * @param {string} id - UUID of the role to delete
 * @returns {Promise<Object>} Deleted role data
 * @throws {Error} If role not found or database operation fails
 */
export const deleteRole = async (id: string) => {
    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
        throw new Error("Role not found");
    }

    await prisma.role.delete({ where: { id } });

    return role;
};

/**
 * Assign permissions to role
 * @description Replaces all permissions for a role with new set of permissions
 * @param {string} roleId - UUID of the role
 * @param {AssignPermissionsInput} data - Array of permission IDs to assign
 * @returns {Promise<Object>} Updated role data with new permissions
 * @throws {Error} If role not found, permissions not found, or database operation fails
 */
export const assignPermissions = async (roleId: string, data: AssignPermissionsInput) => {
    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!role) {
        throw new Error("Role not found");
    }

    // Verify all permissions exist
    const permissions = await prisma.permission.findMany({
        where: { id: { in: data.permission_ids } },
    });

    if (permissions.length !== data.permission_ids.length) {
        throw new Error("One or more permissions not found");
    }

    // Remove existing permissions
    await prisma.rolePermission.deleteMany({
        where: { role_id: roleId },
    });

    // Add new permissions
    await prisma.rolePermission.createMany({
        data: data.permission_ids.map((permissionId) => ({
            role_id: roleId,
            permission_id: permissionId,
        })),
    });

    return getRoleById(roleId);
};
