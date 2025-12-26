import express, { Express, Router } from "express";
import { apiReference } from "@scalar/express-api-reference";
import packageJSON from "../../package.json";
import serveEmojiFavicon from "@/middleware/serve-emoji-favicon";
import { httpLogger } from "@/middleware/http-logger";
import { registerRoute } from "@/lib/route-utils";
import { OpenAPIDocument, OpenAPIOperation, HTTPMethod } from "./openapi-types";
import { logger } from "./logging";

const title = "Express Starter API Documentation";

/**
 * OpenAPI document specification.
 */
const openApiDocument: OpenAPIDocument = {
    openapi: "3.0.0",
    info: {
        title: title,
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
            url: "http://localhost:8000",
            description: "Development server",
        },
    ],
    paths: {},
    components: {
        schemas: {},
        responses: {},
        parameters: {},
        securitySchemes: {},
    },
};

/**
 * Create an Express router with OpenAPI documentation support.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {Router} Express router instance
 */
export function createRouter(): Router {
    return Router();
}

/**
 * Add a path to the OpenAPI document.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {string} path - The API path
 * @param {HTTPMethod} method - HTTP method (get, post, put, delete, etc)
 * @param {OpenAPIOperation} spec - OpenAPI operation specification
 */
export function addPathToDoc(path: string, method: HTTPMethod, spec: OpenAPIOperation): void {
    if (!openApiDocument.paths[path]) {
        openApiDocument.paths[path] = {};
    }
    openApiDocument.paths[path][method] = spec;
}

/**
 * Get the current OpenAPI document.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {OpenAPIDocument} OpenAPI document
 */
export function getOpenApiDocument(): OpenAPIDocument {
    return openApiDocument;
}

/**
 * Create and configure the main Express application.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {Express} Configured Express application
 */
export default function createApp(): Express {
    const app = express();

    // HTTP request logger (harus di paling atas)
    app.use(httpLogger);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Serve emoji favicon
    app.use(serveEmojiFavicon("🚀"));

    // Register OpenAPI JSON route
    registerRoute("openapi.spec", "get", "/openapi.json", "Get OpenAPI 3.0 specification in JSON format");

    // Serve OpenAPI JSON document
    app.get("/openapi.json", (_req, res) => {
        res.json(openApiDocument);
    });

    // Register Scalar docs route
    registerRoute("docs.scalar", "get", "/api/docs", "Interactive API documentation with Scalar UI");

    // Serve Scalar API documentation UI
    app.use(
        "/api/docs",
        apiReference({
            spec: {
                url: "/openapi.json",
            },
            pageTitle: title,
            theme: "laserwave",
            layout: "classic",
            defaultHttpClient: {
                targetKey: "js",
                clientKey: "fetch",
            },
        })
    );

    return app;
}
