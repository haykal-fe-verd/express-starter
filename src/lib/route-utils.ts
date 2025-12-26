import { Express, Router } from "express";
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
 * Extract all routes from Express app.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Express} app - Express application
 * @returns {RouteInfo[]} Array of route information
 */
export function extractRoutes(app: Express): RouteInfo[] {
    const routes: RouteInfo[] = [];
    const stack = (app._router?.stack || []) as any[];

    stack.forEach((middleware) => {
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
        } else if (middleware.name === "router" && middleware.handle.stack) {
            // Router middleware
            const routerPath = middleware.regexp
                .toString()
                .replace("/^", "")
                .replace("\\/?(?=\\/|$)/i", "")
                .replace(/\\\//g, "/");

            middleware.handle.stack.forEach((handler: any) => {
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
const routeRegistry: Map<string, RouteInfo> = new Map();

/**
 * Register a route with metadata.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {string} name - Route name
 * @param {string} method - HTTP method
 * @param {string} path - Route path
 * @param {string} description - Route description
 */
export function registerRoute(name: string, method: string, path: string, description?: string): void {
    const key = `${method.toUpperCase()}:${path}`;
    routeRegistry.set(key, {
        name,
        method: method.toUpperCase(),
        path,
        description,
    });
}

/**
 * Get all registered routes with metadata.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {RouteInfo[]} Array of route information
 */
export function getRegisteredRoutes(): RouteInfo[] {
    return Array.from(routeRegistry.values());
}

/**
 * Display registered routes with metadata.
 * @author Muhammad Haykal
 * @date 2025-12-26
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
    }));

    logger.info("\n📋 Registered Routes:");
    console.table(tableData);
}
