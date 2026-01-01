/**
 * Permission Middleware
 * @description Middleware for permission-based access control
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/application/database";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "@/lib/http-status-codes";

/**
 * Middleware to check if user has required permission(s)
 * @description Validates that authenticated user has all required permissions (AND logic) through their assigned roles
 * @param {string|string[]} permissions - Single permission name or array of permission names
 * @returns {Function} Express middleware function
 * @throws {401} If user is not authenticated
 * @throws {403} If user doesn't have all required permissions
 * @throws {500} If database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const hasPermission = (permissions: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
                data: null,
            });
        }

        try {
            const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

            // Get user permissions through roles
            const userRoles = await prisma.userRole.findMany({
                where: { user_id: req.user.userId },
                include: {
                    role: {
                        include: {
                            role_permissions: {
                                include: {
                                    permission: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            // Collect all permissions from all roles
            const userPermissions = new Set<string>();
            for (const userRole of userRoles) {
                for (const rolePermission of userRole.role.role_permissions) {
                    userPermissions.add(rolePermission.permission.name);
                }
            }

            // Check if user has all required permissions
            const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.has(permission));

            if (!hasAllPermissions) {
                return res.status(FORBIDDEN).json({
                    success: false,
                    message: `Access denied. Required permission(s): ${requiredPermissions.join(", ")}`,
                    data: null,
                });
            }

            next();
        } catch (_error) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to check user permissions",
                data: null,
            });
        }
    };
};
