/**
 * Permissions Controller Module
 * @description Handles HTTP requests for permission management operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { Request, Response } from "express";
import * as httpStatusCodes from "@/lib/http-status-codes";
import * as permissionsService from "@/modules/permissions/permissions.service";
import type {
    CreatePermissionInput,
    GetAllPermissionsParams,
    UpdatePermissionInput,
} from "@/modules/permissions/permissions.validation";

/**
 * Get all permissions with pagination
 * @description Retrieves paginated list of permissions with their role counts
 * @param {Request} req - Express request object with validated query params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with permissions data and pagination metadata
 */
export const index = async (req: Request, res: Response) => {
    try {
        const params = req.validated?.query as GetAllPermissionsParams;
        const result = await permissionsService.getAllPermissions(params);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Permissions retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to retrieve permissions";
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Get permission by ID
 * @description Retrieves single permission details with associated roles
 * @param {Request} req - Express request object with permission ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with permission data or error
 */
export const show = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const permission = await permissionsService.getPermissionById(id);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Permission retrieved successfully",
            data: permission,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to retrieve permission";
        const statusCode =
            message === "Permission not found" ? httpStatusCodes.NOT_FOUND : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Create new permission
 * @description Creates a new permission with unique name
 * @param {Request} req - Express request object with validated permission data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with created permission data or error
 */
export const store = async (req: Request, res: Response) => {
    try {
        const data = req.validated?.body as CreatePermissionInput;
        const permission = await permissionsService.createPermission(data);

        res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create permission";
        const statusCode =
            message === "Permission with this name already exists"
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
 * Update existing permission
 * @description Updates permission information with unique name validation
 * @param {Request} req - Express request object with permission ID in params and validated update data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with updated permission data or error
 */
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.validated?.body as UpdatePermissionInput;
        const permission = await permissionsService.updatePermission(id, data);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Permission updated successfully",
            data: permission,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update permission";
        const statusCode =
            message === "Permission not found"
                ? httpStatusCodes.NOT_FOUND
                : message === "Permission with this name already exists"
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
 * Delete permission
 * @description Deletes a permission and cascades to role_permissions junction table
 * @param {Request} req - Express request object with permission ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with deleted permission data or error
 */
export const destroy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const permission = await permissionsService.deletePermission(id);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Permission deleted successfully",
            data: permission,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete permission";
        const statusCode =
            message === "Permission not found" ? httpStatusCodes.NOT_FOUND : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};
