/**
 * Auth Controller Module
 * @description Handles HTTP requests for authentication operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { Request, Response } from "express";
import * as httpStatusCodes from "@/lib/http-status-codes";
import * as httpStatusPhrases from "@/lib/http-status-phrases";
import * as authService from "@/modules/auth/auth.service";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "@/modules/auth/auth.validation";

/**
 * Register a new user
 * @description Handles user registration request and returns JWT tokens
 * @param {Request} req - Express request object with validated registration data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with tokens or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const register = async (req: Request, res: Response) => {
    try {
        const data = req.validated?.body as RegisterInput;

        const tokens = await authService.register(data);

        res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: tokens,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to register user";
        const statusCode =
            message === "User with this email already exists"
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
 * Login user
 * @description Handles user login request and returns JWT tokens
 * @param {Request} req - Express request object with validated login credentials in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with tokens or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const login = async (req: Request, res: Response) => {
    try {
        const data = req.validated?.body as LoginInput;

        const tokens = await authService.login(data);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Login successful",
            data: tokens,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to login";
        const statusCode =
            message === "Invalid credentials" ? httpStatusCodes.UNAUTHORIZED : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Refresh access token
 * @description Handles token refresh request and returns new JWT tokens
 * @param {Request} req - Express request object with refresh token in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with new tokens or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const data = req.validated?.body as RefreshTokenInput;

        const tokens = await authService.refreshToken(data);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Token refreshed successfully",
            data: tokens,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to refresh token";
        const statusCode =
            message === "Invalid or expired refresh token" || message === "User not found"
                ? httpStatusCodes.UNAUTHORIZED
                : httpStatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message,
            data: null,
        });
    }
};

/**
 * Get authenticated user profile
 * @description Retrieves profile of currently authenticated user
 * @param {Request} req - Express request object with user info from auth middleware
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with user profile or error
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(httpStatusCodes.UNAUTHORIZED).json({
                success: false,
                message: httpStatusPhrases.UNAUTHORIZED,
                data: null,
            });
        }

        const user = await authService.getProfile(userId);

        res.status(httpStatusCodes.OK).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get profile";

        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
            data: null,
        });
    }
};
