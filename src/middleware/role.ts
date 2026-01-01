/**
 * Role Middleware
 * @description Middleware for role-based access control (RBAC)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/application/database";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "@/lib/http-status-codes";

/**
 * Middleware to check if user has required role(s)
 * @description Validates that authenticated user has at least one of the required roles (OR logic)
 * @param {string|string[]} roles - Single role name or array of role names
 * @returns {Function} Express middleware function
 * @throws {401} If user is not authenticated
 * @throws {403} If user doesn't have any of the required roles
 * @throws {500} If database operation fails
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const hasRole = (roles: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.userId) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
                data: null,
            });
        }

        try {
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            // Get user roles from database
            const userRoles = await prisma.userRole.findMany({
                where: { user_id: req.user.userId },
                include: {
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            const userRoleNames = userRoles.map((ur) => ur.role.name);

            // Check if user has any of the required roles
            const hasRequiredRole = allowedRoles.some((role) => userRoleNames.includes(role));

            if (!hasRequiredRole) {
                return res.status(FORBIDDEN).json({
                    success: false,
                    message: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
                    data: null,
                });
            }

            next();
        } catch (_error) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to check user role",
                data: null,
            });
        }
    };
};
