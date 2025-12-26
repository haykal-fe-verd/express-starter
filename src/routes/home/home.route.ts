import { Router } from "express";
import { addPathToDoc } from "@/application/create-app";
import { registerRoute } from "@/lib/route-utils";
import { homeHandler } from "./home.handler";
import { homeSchema } from "./home.validation";

/**
 * Home routes with OpenAPI documentation.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {Router} Express router with home routes
 */
export const homeRoutes = (): Router => {
    const router = Router();

    const routePath = "/";
    const method = "get";

    // Register route metadata
    registerRoute("home.index", method, routePath, "Display home page with documentation links");

    // Register OpenAPI documentation
    addPathToDoc(routePath, method, {
        summary: "Home Page",
        description: "Get the home page with links to documentation",
        tags: ["Home"],
        operationId: "getHomePage",
        ...homeSchema,
    });

    // Register route
    router.get("/", homeHandler);

    return router;
};
