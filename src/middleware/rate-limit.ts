/**
 * Rate Limit Middleware
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import type { NextFunction, Request, Response } from "express";
import { logger } from "@/application/logging";
import { getRedis } from "@/application/redis";

interface RateLimitOptions {
    windowMs?: number; // Time window in milliseconds
    max?: number; // Max requests per window
    message?: string; // Error message
    keyGenerator?: (req: Request) => string; // Custom key generator
    skipSuccessfulRequests?: boolean; // Skip counting successful requests
    skipFailedRequests?: boolean; // Skip counting failed requests
}

const defaultOptions: Required<RateLimitOptions> = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: "Too many requests, please try again later.",
    keyGenerator: (req: Request) => {
        // Default: use IP address
        return req.ip || req.socket.remoteAddress || "unknown";
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
};

/**
 * Create rate limiter middleware
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {RateLimitOptions} options
 *
 * @returns {RequestHandler}
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
    const opts = { ...defaultOptions, ...options };

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const redis = getRedis();
            const key = `rate-limit:${opts.keyGenerator(req)}`;
            const now = Date.now();
            const windowStart = now - opts.windowMs;

            // Remove old entries outside the time window
            await redis.zRemRangeByScore(key, 0, windowStart);

            // Get current request count
            const requestCount = await redis.zCard(key);

            if (requestCount >= opts.max) {
                // Get TTL for the key
                const ttl = await redis.pTTL(key);
                const resetTime = ttl > 0 ? Math.ceil(ttl / 1000) : Math.ceil(opts.windowMs / 1000);

                res.setHeader("X-RateLimit-Limit", opts.max.toString());
                res.setHeader("X-RateLimit-Remaining", "0");
                res.setHeader("X-RateLimit-Reset", resetTime.toString());
                res.setHeader("Retry-After", resetTime.toString());

                res.status(429).json({
                    message: opts.message,
                    retryAfter: resetTime,
                });
                return;
            }

            // Add current request to sorted set
            await redis.zAdd(key, {
                score: now,
                value: `${now}:${Math.random()}`,
            });

            // Set expiration on the key
            await redis.expire(key, Math.ceil(opts.windowMs / 1000));

            // Set rate limit headers
            res.setHeader("X-RateLimit-Limit", opts.max.toString());
            res.setHeader("X-RateLimit-Remaining", (opts.max - requestCount - 1).toString());
            res.setHeader("X-RateLimit-Reset", Math.ceil(opts.windowMs / 1000).toString());

            // Handle response to optionally skip counting
            if (opts.skipSuccessfulRequests || opts.skipFailedRequests) {
                const originalSend = res.send;
                res.send = function (body) {
                    const statusCode = res.statusCode;
                    const shouldSkip =
                        (opts.skipSuccessfulRequests && statusCode < 400) ||
                        (opts.skipFailedRequests && statusCode >= 400);

                    if (shouldSkip) {
                        redis.zRem(key, `${now}:${Math.random()}`).catch((err: Error) => {
                            logger.error({
                                tag: "RATE-LIMIT",
                                message: "Error removing request",
                                error: err,
                            });
                        });
                    }

                    return originalSend.call(this, body);
                };
            }

            next();
        } catch (error) {
            logger.error({ tag: "RATE-LIMIT", message: "Rate limiter error", error });
            // On error, allow the request to proceed
            next();
        }
    };
}

/**
 * Default rate limiter (100 requests per minute)
 */
export const rateLimiter = createRateLimiter();

/**
 * Strict rate limiter (10 requests per minute)
 */
export const strictRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many requests. Please slow down.",
});

/**
 * Auth rate limiter (5 requests per 15 minutes)
 */
export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many authentication attempts. Please try again later.",
    keyGenerator: (req: Request) => {
        // Use both IP and username/email if available
        const identifier = req.body?.email || req.body?.username || "";
        return `${req.ip}:${identifier}`;
    },
});
