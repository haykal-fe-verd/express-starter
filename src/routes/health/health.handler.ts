import { Request, Response } from "express";
import { OK } from "@/lib/http-status-codes";

/**
 * Health check handler.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Response} JSON response with health status
 */
export const healthCheckHandler = (_req: Request, res: Response) => {
    return res.status(OK).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: "Service is healthy",
    });
};
