import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes";
import env from "@/application/env";

/**
 * Error handling middleware for Express.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Response} JSON response with error details
 */
const onError: ErrorRequestHandler = (err, req, res, next) => {
    const currentStatus = "status" in err ? err.status : res.statusCode;
    const statusCode = currentStatus !== OK ? currentStatus : INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        message: err.message,
        stack: env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

export default onError;
