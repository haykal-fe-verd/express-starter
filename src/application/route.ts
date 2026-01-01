/**
 * Routing Module
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import fs from "node:fs";
import path from "node:path";
import { type Express, type NextFunction, type Request, type RequestHandler, type Response, Router } from "express";
import type { ZodType } from "zod";
import { logger } from "@/application/logging";
import { displayRegisteredRoutes, registerRoute } from "@/lib/route-utils";
import { rateLimiter } from "@/middleware/rate-limit";

type AnyZodSchema = ZodType;

type ZodValidation = Partial<{
    body: AnyZodSchema;
    query: AnyZodSchema;
    params: AnyZodSchema;
    headers: AnyZodSchema;
}>;

type ZodResponses = Partial<{
    200: AnyZodSchema;
    201: AnyZodSchema;
    204: AnyZodSchema;
    400: AnyZodSchema;
    401: AnyZodSchema;
    403: AnyZodSchema;
    404: AnyZodSchema;
    409: AnyZodSchema;
    422: AnyZodSchema;
    500: AnyZodSchema;
}>;

type Middleware = RequestHandler | RequestHandler[];
type ValidatedData = Partial<{
    body: unknown;
    query: unknown;
    params: unknown;
    headers: unknown;
}>;

interface RouteOptions {
    name: string;
    basePath: string;
    description?: string;
    permission?: string | string[];
    authenticated?: boolean;
    validation?: ZodValidation;
    responses?: ZodResponses;
    middleware?: Middleware;
    disabledRateLimiter?: boolean;
}

const namedRoutes: { [key: string]: string } = {};

/**
 * Ensure path start with '/'
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {string} path
 *
 * @returns {string}
 */
function ensureLeadingSlash(path: string): string {
    return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Mount the routes to express application
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {Express} app
 * @param {string} file
 * @param {string} fallback
 *
 * @returns {void}
 */
function loadAndMount(app: Express, file: string, fallback: string): void {
    const { default: router, path: customPath } = require(file) as {
        default: Router;
        path?: string;
    };

    const routePath = ensureLeadingSlash(customPath || fallback);
    app.use(routePath, router);
}

/**
 * Define route name
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @exports
 *
 * @param {string} name name for the route
 * @param {string} routePath main route path
 * @param {string} path sub route path
 * @param {string} method HTTP method
 * @param {RouteOptions} options Route options
 *
 * @returns {string}
 */
function defineRoute(name: string, routePath: string, path: string, method: string, options: RouteOptions): string {
    const fullPath = routePath ? ensureLeadingSlash(routePath) + path : path;
    namedRoutes[name] = fullPath;

    // Register to route-utils with full metadata
    registerRoute({
        name,
        method,
        path: fullPath,
        description: options.description,
        validation: options.validation,
        responses: options.responses,
        authenticated: options.authenticated,
        permission: options.permission,
    });

    return path;
}

/**
 * Get route URL by name
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @exports
 *
 * @param {string} name
 * @param {Record<string, string | number>} [params={}]
 * @param {boolean} [safeError=true]
 *
 * @returns {string}
 */
function getRoute(name: string, params: Record<string, string | number> = {}, safeError = true): string {
    let route = namedRoutes[name];
    if (!route && safeError) throw new Error(`Route name "${name}" not found.`);
    if (!route) return "";

    const queryParams: Record<string, string | number> = {};

    // Replace URL parameters and collect unused params for query string
    for (const key in params) {
        const paramPattern = `:${key}`;
        if (route.includes(paramPattern)) {
            // Replace URL parameter
            route = route.replace(paramPattern, String(params[key]));
        } else {
            // Add to query parameters
            queryParams[key] = params[key];
        }
    }

    // Remove trailing slash
    route = route.replace(/\/$/, "");

    // Add query string if there are unused parameters
    const queryString = new URLSearchParams(
        Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    ).toString();

    return queryString ? `${route}?${queryString}` : route;
}

/**
 * Zod Validator Middleware
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {ZodValidation} validation
 *
 * @returns {RequestHandler}
 */
function zodValidator(validation: ZodValidation): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated: ValidatedData = {};
        const issues: Array<{ where: string; path: string; message: string }> = [];

        const run = (where: keyof ZodValidation, value: unknown): void => {
            const schema = validation[where];
            if (!schema) return;

            const result = schema.safeParse(value);
            if (!result.success) {
                for (const i of result.error.issues) {
                    issues.push({
                        where,
                        path: i.path.join("."),
                        message: i.message,
                    });
                }
                return;
            }

            validated[where] = result.data;

            // Only overwrite body (query, params, headers are read-only)
            if (where === "body") {
                req.body = result.data;
            }
        };

        run("params", req.params);
        run("query", req.query);
        run("body", req.body);
        run("headers", req.headers);

        if (issues.length > 0) {
            return res.status(422).json({
                status: "error",
                message: "Validation error",
                errors: issues,
            });
        }

        req.validated = { ...(req.validated ?? {}), ...validated };
        return next();
    };
}

/**
 * Apply middleware stack to route
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {RequestHandler} controller
 * @param {RouteOptions} options
 *
 * @returns {Middleware[]}
 */
function applyMiddlewareStack(controller: RequestHandler, options: RouteOptions): Middleware[] {
    const stack: Middleware[] = [];

    // Rate limiter (enabled by default unless disabled)
    if (!options.disabledRateLimiter) {
        stack.push(rateLimiter);
    }

    // OPTIONAL (kalau kamu punya auth/permission middleware)
    // if (options.authenticated) stack.push(isAuthenticated);
    // if (options.permission && options.authenticated) {
    //   stack.push(isAllowed(options.permission));
    // }

    // Zod validation
    if (options.validation) stack.push(zodValidator(options.validation));

    // Additional middleware
    if (options.middleware) {
        if (Array.isArray(options.middleware)) stack.push(...options.middleware);
        else stack.push(options.middleware);
    }

    // Controller
    stack.push(controller);

    return stack;
}

/**
 * Router helper.
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @exports
 *
 * @returns {object} Router object with HTTP method helpers
 */
function router() {
    const router = Router({ mergeParams: true });

    return {
        // GET
        get: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "GET", options);
            return router.get(path, ...applyMiddlewareStack(controller, options));
        },

        // POST
        post: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "POST", options);
            return router.post(path, ...applyMiddlewareStack(controller, options));
        },

        // PUT
        put: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "PUT", options);
            return router.put(path, ...applyMiddlewareStack(controller, options));
        },

        // PATCH
        patch: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "PATCH", options);
            return router.patch(path, ...applyMiddlewareStack(controller, options));
        },

        // DELETE
        delete: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "DELETE", options);
            return router.delete(path, ...applyMiddlewareStack(controller, options));
        },

        // USE
        use: (path: string, controller: RequestHandler, options: RouteOptions) => {
            defineRoute(options.name, options.basePath, path, "USE", options);
            return router.use(path, ...applyMiddlewareStack(controller, options));
        },

        // Router
        init: () => router,
    };
}

/**
 * Register Route Modules
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @exports
 *
 * @param {Express} app
 * @param {boolean} showNamedRoute
 *
 * @param {Express} app
 */
function registerModules(app: Express, showNamedRoute?: boolean): void {
    logger.info({ tag: "ROUTE", message: "Registering routes..." });

    const modulesRoot = path.join(__dirname, "..", "modules");

    const walkAndMount = (dir: string, prefix: string) => {
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);

            // Check if directory
            if (fs.statSync(fullPath).isDirectory()) {
                // Look for <module>.route.ts or <module>.route.js
                const routeFileTs = path.join(fullPath, `${entry}.route.ts`);
                const routeFileJs = path.join(fullPath, `${entry}.route.js`);
                const routeFile = fs.existsSync(routeFileTs)
                    ? routeFileTs
                    : fs.existsSync(routeFileJs)
                    ? routeFileJs
                    : null;

                if (routeFile) {
                    const mountPath = prefix ? `${prefix}/${entry}` : entry;
                    console.log(`Mounting route: ${mountPath.toUpperCase()}`);
                    loadAndMount(app, routeFile, mountPath);
                }

                // Recursively walk subdirectories
                const mountPrefix = prefix ? `${prefix}/${entry}` : entry;
                walkAndMount(fullPath, mountPrefix);
            }
        }
    };

    walkAndMount(modulesRoot, "");

    logger.info({ tag: "ROUTE", message: "Routes registered successfully" });

    if (showNamedRoute) {
        displayRegisteredRoutes();
    }
}

export { defineRoute, getRoute, router, registerModules };
