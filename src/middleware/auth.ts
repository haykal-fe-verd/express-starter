/**
 * Authentication Middleware
 * @description Middleware for JWT token authentication and user authorization
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { NextFunction, Request, Response } from "express";
import * as httpStatusCodes from "@/lib/http-status-codes";
import * as httpStatusPhrases from "@/lib/http-status-phrases";
import { verifyAccessToken } from "@/lib/jwt";

/**
 * Middleware to authenticate user using JWT token
 * @description Validates JWT access token from Authorization header and attaches user info to request
 * @param {Request} req - Express request object (expects Authorization: Bearer <token> header)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void} Calls next() if authenticated, otherwise sends 401 Unauthorized response
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Missing or invalid authorization header",
            data: null,
        });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const payload = verifyAccessToken(token);

    if (!payload) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
            success: false,
            message: httpStatusPhrases.UNAUTHORIZED,
            data: null,
        });
    }

    // Attach user info to request
    req.user = {
        userId: payload.userId,
        email: payload.email,
    };

    next();
};

/**
 * Middleware to optionally authenticate user
 * @description Attempts to validate JWT token but doesn't fail if token is missing or invalid
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next middleware function
 * @returns {void} Always calls next(), attaches user info if token is valid
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        if (payload) {
            req.user = {
                userId: payload.userId,
                email: payload.email,
            };
        }
    }

    next();
};
