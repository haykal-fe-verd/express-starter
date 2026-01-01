/**
 * Auth Route Module
 * @description Route definitions for authentication endpoints
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import z from "zod";
import { router } from "@/application/route";
import { INTERNAL_SERVER_ERROR_SCHEMA, UNPROCESSABLE_ENTITY_SCHEMA } from "@/lib/constants";
import {
    CONFLICT,
    CREATED,
    INTERNAL_SERVER_ERROR,
    OK,
    UNAUTHORIZED,
    UNPROCESSABLE_ENTITY,
} from "@/lib/http-status-codes";
import { authenticate } from "@/middleware/auth";
import * as controller from "@/modules/auth/auth.controller";
import {
    loginResponseSchema,
    loginSchema,
    profileResponseSchema,
    refreshTokenResponseSchema,
    refreshTokenSchema,
    registerResponseSchema,
    registerSchema,
} from "@/modules/auth/auth.validation";

const route = router();

const basePath = "/auth";

/**
 * Error response schema
 * @description Standard error response structure
 */
const errorResponseSchema = z.object({
    success: z.literal(false).meta({ description: "Response status", example: false }),
    message: z.string().meta({ description: "Error message", example: "Authentication failed" }),
    data: z.null().meta({ description: "No data on error", example: null }),
});

/**
 * @route POST /auth/register
 * @description Register a new user account
 * @access Public
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.post("/register", controller.register, {
    name: "auth.register",
    basePath,
    description: "Register a new user account",
    authenticated: false,
    validation: {
        body: registerSchema,
    },
    responses: {
        [CREATED]: registerResponseSchema,
        [CONFLICT]: errorResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /auth/login
 * @description Login with email and password
 * @access Public
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.post("/login", controller.login, {
    name: "auth.login",
    basePath,
    description: "Login with email and password",
    authenticated: false,
    validation: {
        body: loginSchema,
    },
    responses: {
        [OK]: loginResponseSchema,
        [UNAUTHORIZED]: errorResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /auth/refresh
 * @description Refresh access token using refresh token
 * @access Public
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.post("/refresh", controller.refreshToken, {
    name: "auth.refresh",
    basePath,
    description: "Refresh access token using refresh token",
    authenticated: false,
    validation: {
        body: refreshTokenSchema,
    },
    responses: {
        [OK]: refreshTokenResponseSchema,
        [UNAUTHORIZED]: errorResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route GET /auth/profile
 * @description Get authenticated user profile
 * @access Authenticated
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.get("/profile", controller.getProfile, {
    name: "auth.profile",
    basePath,
    description: "Get authenticated user profile",
    authenticated: true,
    middleware: [authenticate],
    responses: {
        [OK]: profileResponseSchema,
        [UNAUTHORIZED]: errorResponseSchema,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

export default route.init();
