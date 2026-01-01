/**
 * Logger Middleware
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import type { NextFunction, Request, Response } from "express";
import { logger, maskSensitive } from "@/application/logging";
import * as HttpStatusCodes from "@/lib/http-status-codes";

/**
 * HTTP request logging middleware using Winston.
 * Logs all incoming HTTP requests with method, URL, status code, and response time.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;

    // Log request
    logger.http("Incoming request", {
        method,
        url: originalUrl,
        ip: ip || req.socket.remoteAddress,
        userAgent: headers["user-agent"],
        headers: maskSensitive(headers as Record<string, unknown>),
    });

    // Capture response finish event
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const { statusCode } = res;

        const logLevel =
            statusCode >= HttpStatusCodes.INTERNAL_SERVER_ERROR
                ? "error"
                : statusCode >= HttpStatusCodes.BAD_REQUEST
                ? "warn"
                : "http";

        logger[logLevel]("Request completed", {
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip: ip || req.socket.remoteAddress,
            userAgent: headers["user-agent"],
        });
    });

    next();
};
