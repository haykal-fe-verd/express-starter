/**
 * OpenAPI Generation Utilities
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import type { ZodTypeAny } from "zod";
import z from "zod";
import type { RouteMetadata } from "@/lib/route-utils";

interface OpenAPIParameter {
    name: string;
    in: "path" | "query" | "header";
    required: boolean;
    schema: unknown;
}

interface OpenAPIOperation {
    operationId: string;
    summary: string;
    description: string;
    tags: string[];
    security?: Array<{ bearerAuth: string[] }>;
    parameters?: OpenAPIParameter[];
    requestBody?: {
        required: boolean;
        content: {
            "application/json": {
                schema: unknown;
            };
        };
    };
    responses: Record<
        string,
        {
            description: string;
            content?: {
                "application/json": {
                    schema: unknown;
                };
            };
        }
    >;
}

/**
 * Convert Zod schema to JSON Schema
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {ZodType} zodSchema
 *
 * @returns {json}
 */
export const convertToJsonSchema = (zodSchema: z.ZodType) => {
    return z.toJSONSchema(zodSchema, { target: "openapi-3.0" });
};

/**
 * Generate OpenAPI paths from route metadata
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {RouteMetadata[]} routes
 *
 * @returns {Record<string, Record<string, OpenAPIOperation>>}
 */
export function generateOpenApiPaths(routes: RouteMetadata[]) {
    const paths: Record<string, Record<string, OpenAPIOperation>> = {};

    for (const route of routes) {
        const pathKey = route.path;
        const method = route.method.toLowerCase();

        // Initialize path if not exists
        if (!paths[pathKey]) {
            paths[pathKey] = {};
        }

        // Build operation object
        const operation: OpenAPIOperation = {
            operationId: route.name,
            summary: route.name,
            description: route.description || "",
            tags: [extractTagFromPath(route.path)],
            responses: {},
        };

        // Add security if authenticated
        if (route.authenticated) {
            operation.security = [{ bearerAuth: [] }];
        }

        // Add parameters (path, query, headers)
        const parameters: OpenAPIParameter[] = [];

        // Path parameters
        if (route.validation?.params) {
            const paramsSchema = convertToJsonSchema(route.validation.params);
            if (paramsSchema.properties) {
                for (const [name, schema] of Object.entries(paramsSchema.properties)) {
                    parameters.push({
                        name,
                        in: "path",
                        required: paramsSchema.required?.includes(name) || false,
                        schema,
                    });
                }
            }
        }

        // Query parameters
        if (route.validation?.query) {
            const querySchema = convertToJsonSchema(route.validation.query);
            if (querySchema.properties) {
                for (const [name, schema] of Object.entries(querySchema.properties)) {
                    parameters.push({
                        name,
                        in: "query",
                        required: querySchema.required?.includes(name) || false,
                        schema,
                    });
                }
            }
        }

        // Header parameters
        if (route.validation?.headers) {
            const headersSchema = convertToJsonSchema(route.validation.headers);
            if (headersSchema.properties) {
                for (const [name, schema] of Object.entries(headersSchema.properties)) {
                    parameters.push({
                        name,
                        in: "header",
                        required: headersSchema.required?.includes(name) || false,
                        schema,
                    });
                }
            }
        }

        if (parameters.length > 0) {
            operation.parameters = parameters;
        }

        // Add request body
        if (route.validation?.body) {
            const bodySchema = convertToJsonSchema(route.validation.body);
            operation.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: bodySchema,
                    },
                },
            };
        }

        // Add responses
        if (route.responses) {
            for (const [statusCode, schema] of Object.entries(route.responses)) {
                const responseSchema = convertToJsonSchema(schema as ZodTypeAny);
                operation.responses[statusCode] = {
                    description: getResponseDescription(statusCode),
                    content: {
                        "application/json": {
                            schema: responseSchema,
                        },
                    },
                };
            }
        } else {
            // Default response
            operation.responses["200"] = {
                description: "Success",
            };
        }

        paths[pathKey][method] = operation;
    }

    return paths;
}

/**
 * Extract tag name from route path
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {string} path
 *
 * @returns {string}
 */
function extractTagFromPath(path: string): string {
    const parts = path.split("/").filter(Boolean);
    if (parts.length > 0) {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return "Default";
}

/**
 * Get response description based on status code
 * @author Muhammad Haykal
 * @date 2025-12-31
 *
 * @param {string} statusCode
 * @returns {string}
 */
function getResponseDescription(statusCode: string): string {
    const descriptions: Record<string, string> = {
        "200": "Success",
        "201": "Created",
        "204": "No Content",
        "400": "Bad Request",
        "401": "Unauthorized",
        "403": "Forbidden",
        "404": "Not Found",
        "409": "Conflict",
        "422": "Unprocessable Entity",
        "500": "Internal Server Error",
    };
    return descriptions[statusCode] || "Response";
}
