/**
 * Roles Controller Module
 * @description Handles HTTP requests for role management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { Request, Response } from "express";
import * as httpStatusCodes from "@/lib/http-status-codes";
import * as rolesService from "@/modules/roles/roles.service";
import type {
    AssignPermissionsInput,
    CreateRoleInput,
    GetAllRolesParams,
    UpdateRoleInput,
} from "@/modules/roles/roles.validation";

/**
 * Get all roles with pagination
 * @description Retrieves paginated list of roles with their permission and user counts
 * @param {Request} req - Express request object with validated query params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with roles data and pagination metadata
 */
export const index = async (req: Request, res: Response) => {
    try {
        const params = req.validated?.query as GetAllRolesParams;
        const result = await rolesService.getAllRoles(params);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Roles retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to retrieve roles";
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Get role by ID
 * @description Retrieves single role details with associated permissions
 * @param {Request} req - Express request object with role ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with role data or error
 */
export const show = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const role = await rolesService.getRoleById(id);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Role retrieved successfully",
            data: role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to retrieve role";
        const statusCode =
            message === "Role not found" ? httpStatusCodes.NOT_FOUND : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Create new role
 * @description Creates a new role with unique name
 * @param {Request} req - Express request object with validated role data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with created role data or error
 */
export const store = async (req: Request, res: Response) => {
    try {
        const data = req.validated?.body as CreateRoleInput;
        const role = await rolesService.createRole(data);

        res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create role";
        const statusCode =
            message === "Role with this name already exists"
                ? httpStatusCodes.CONFLICT
                : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Update existing role
 * @description Updates role information with unique name validation
 * @param {Request} req - Express request object with role ID in params and validated update data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with updated role data or error
 */
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.validated?.body as UpdateRoleInput;
        const role = await rolesService.updateRole(id, data);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update role";
        const statusCode =
            message === "Role not found"
                ? httpStatusCodes.NOT_FOUND
                : message === "Role with this name already exists"
                ? httpStatusCodes.CONFLICT
                : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Delete role
 * @description Deletes a role and cascades to role_permissions and user_roles junction tables
 * @param {Request} req - Express request object with role ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with deleted role data or error
 */
export const destroy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const role = await rolesService.deleteRole(id);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Role deleted successfully",
            data: role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete role";
        const statusCode =
            message === "Role not found" ? httpStatusCodes.NOT_FOUND : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Assign permissions to role
 * @description Assigns multiple permissions to a role (replaces existing assignments)
 * @param {Request} req - Express request object with role ID in params and permission IDs in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with role data including new permissions or error
 */
export const assignPermissions = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.validated?.body as AssignPermissionsInput;
        const role = await rolesService.assignPermissions(id, data);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Permissions assigned successfully",
            data: role,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to assign permissions";
        const statusCode =
            message === "Role not found" || message === "One or more permissions not found"
                ? httpStatusCodes.NOT_FOUND
                : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};
