import { Router } from "express";
import { addPathToDoc } from "@/application/create-app";
import { registerRoute } from "@/lib/route-utils";
import { healthCheckHandler } from "./health.handler";
import { healthCheckSchema } from "./health.validation";

/**
 * Health check routes with OpenAPI documentation.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {Router} Express router with health check routes
 */
export const healthRoutes = (): Router => {
    const router = Router();

    const routePath = "/api/health";
    const method = "get";

    // Register route metadata
    registerRoute("health.check", method, routePath, "Check service health status");

    // Register OpenAPI documentation
    addPathToDoc(routePath, method, {
        summary: "Health Check",
        description: "Check if the service is running and healthy",
        tags: ["Health"],
        operationId: "healthCheck",
        ...healthCheckSchema,
    });

    // Register route
    router.get("/health", healthCheckHandler);

    return router;
};
