import { apiReference } from "@scalar/express-api-reference";
import type { Express } from "express";
import env from "@/application/env";
import { generateOpenApiPaths } from "@/lib/open-api";
import { getRegisteredRoutes, registerRoute } from "@/lib/route-utils";
import packageJSON from "../../package.json";

const title = "Express Starter API Documentation";

/**
 * Setup Scalar API documentation
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {Express} app Express application instance
 */
export function setupScalarDocs(app: Express): void {
    // Register /docs route to registry
    registerRoute({
        name: "docs",
        method: "GET",
        path: "/docs",
        description: "API Documentation (Scalar)",
        authenticated: false,
    });

    // Get all registered routes
    const routes = getRegisteredRoutes();

    // Generate OpenAPI paths from routes
    const paths = generateOpenApiPaths(routes);

    // Extract unique tags
    const tags = Array.from(
        new Set(
            routes.map((route) => {
                const parts = route.path.split("/").filter(Boolean);
                if (parts.length > 0) {
                    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                }
                return "Default";
            })
        )
    ).map((name) => ({ name, description: `${name} endpoints` }));

    const openApiSpec = {
        openapi: "3.0.0",
        info: {
            title,
            version: packageJSON.version,
            description: packageJSON.description,
            contact: {
                name: packageJSON.author.name,
                url: packageJSON.author.url,
                email: packageJSON.author.email,
            },
            license: {
                name: "MIT",
                url: "https://github.com/haykal-fe-verd/express-starter?tab=MIT-1-ov-file",
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: `Local server running on port ${env.PORT}`,
            },
        ],
        tags,
        paths,
        components: {
            schemas: {},
            responses: {},
            parameters: {},
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    };

    app.use(
        "/docs",
        apiReference({
            pageTitle: title,
            theme: "laserwave",
            layout: "classic",
            defaultHttpClient: {
                targetKey: "js",
                clientKey: "fetch",
            },
            spec: {
                content: openApiSpec,
            },
        })
    );
}
