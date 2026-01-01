/**
 * Utility functions for Express route management and introspection.
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import type { Express } from "express";
import type { ZodTypeAny } from "zod";
import { logger } from "@/application/logging";

/**
 * Route information interface.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
export interface RouteInfo {
    name: string;
    method: string;
    path: string;
    description?: string;
}

/**
 * Route metadata interface with full validation support.
 * @author Muhammad Haykal
 * @date 2025-12-31
 */
export interface RouteMetadata {
    name: string;
    method: string;
    path: string;
    description?: string;
    validation?: {
        body?: ZodTypeAny;
        query?: ZodTypeAny;
        params?: ZodTypeAny;
        headers?: ZodTypeAny;
    };
    responses?: Partial<{
        200: ZodTypeAny;
        201: ZodTypeAny;
        204: ZodTypeAny;
        400: ZodTypeAny;
        401: ZodTypeAny;
        403: ZodTypeAny;
        404: ZodTypeAny;
        422: ZodTypeAny;
        500: ZodTypeAny;
    }>;
    authenticated?: boolean;
    permission?: string | string[];
}

/**
 * Express internal types for router introspection
 */
interface ExpressRoute {
    path: string;
    methods: Record<string, boolean>;
}

interface ExpressLayer {
    name: string;
    regexp: RegExp;
    route?: ExpressRoute;
    handle?: {
        stack?: ExpressLayer[];
    };
}

interface ExpressRouter {
    stack?: ExpressLayer[];
}

/**
 * Extract all routes from Express app.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Express} app - Express application
 * @returns {RouteInfo[]} Array of route information
 */
export function extractRoutes(app: Express): RouteInfo[] {
    const routes: RouteInfo[] = [];
    const router = (app as Express & { _router?: ExpressRouter })._router;
    const stack = router?.stack || [];

    stack.forEach((middleware: ExpressLayer) => {
        if (middleware.route) {
            // Single route
            const route = middleware.route;
            const methods = Object.keys(route.methods).map((m) => m.toUpperCase());
            methods.forEach((method) => {
                routes.push({
                    name: route.path,
                    method,
                    path: route.path,
                });
            });
        } else if (middleware.name === "router" && middleware.handle?.stack) {
            // Router middleware
            const routerPath = middleware.regexp
                .toString()
                .replace("/^", "")
                .replace("\\/?(?=\\/|$)/i", "")
                .replace(/\\\//g, "/");

            middleware.handle.stack.forEach((handler: ExpressLayer) => {
                if (handler.route) {
                    const route = handler.route;
                    const methods = Object.keys(route.methods).map((m) => m.toUpperCase());
                    const fullPath = routerPath + route.path;
                    methods.forEach((method) => {
                        routes.push({
                            name: fullPath,
                            method,
                            path: fullPath.replace(/\\/g, ""),
                        });
                    });
                }
            });
        }
    });

    return routes;
}

/**
 * Display routes in a formatted table.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Express} app - Express application
 */
export function displayRoutes(app: Express): void {
    const routes = extractRoutes(app);

    if (routes.length === 0) {
        logger.warn("No routes registered");
        return;
    }

    // Sort by path and method
    const sortedRoutes = routes.sort((a, b) => {
        if (a.path === b.path) {
            return a.method.localeCompare(b.method);
        }
        return a.path.localeCompare(b.path);
    });

    // Format for console.table
    const tableData = sortedRoutes.map((route) => ({
        Method: route.method,
        Path: route.path,
        Name: route.name || "-",
    }));

    logger.info("\n📋 Registered Routes:");
    console.table(tableData);
}

/**
 * Route registry for storing route metadata.
 */
const routeRegistry: Map<string, RouteMetadata> = new Map();

/**
 * Register a route with full metadata.
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {RouteMetadata} metadata - Complete route metadata
 */
export function registerRoute(metadata: RouteMetadata): void {
    const key = `${metadata.method.toUpperCase()}:${metadata.path}`;
    routeRegistry.set(key, {
        ...metadata,
        method: metadata.method.toUpperCase(),
    });
}

/**
 * Get all registered routes with metadata.
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @returns {RouteMetadata[]} Array of route metadata
 */
export function getRegisteredRoutes(): RouteMetadata[] {
    return Array.from(routeRegistry.values());
}

/**
 * Display registered routes with metadata.
 * @author Muhammad Haykal
 * @date 2025-12-31
 */
export function displayRegisteredRoutes(): void {
    const routes = getRegisteredRoutes();

    if (routes.length === 0) {
        logger.warn("No routes registered");
        return;
    }

    // Sort by path and method
    const sortedRoutes = routes.sort((a, b) => {
        if (a.path === b.path) {
            return a.method.localeCompare(b.method);
        }
        return a.path.localeCompare(b.path);
    });

    // Format for console.table
    const tableData = sortedRoutes.map((route) => ({
        Name: route.name,
        Method: route.method,
        Path: route.path,
        Description: route.description || "-",
        Auth: route.authenticated ? "Yes" : "No",
    }));

    logger.info("\n📋 Registered Routes:");
    console.table(tableData);
}
