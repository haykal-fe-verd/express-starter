/**
 * OpenAPI 3.0.0 Type Definitions
 * @author Muhammad Haykal
 * @date 2025-12-26
 */

export interface OpenAPIContact {
    name?: string;
    url?: string;
    email?: string;
}

export interface OpenAPILicense {
    name: string;
    url?: string;
}

export interface OpenAPIInfo {
    title: string;
    version: string;
    description?: string;
    contact?: OpenAPIContact;
    license?: OpenAPILicense;
    termsOfService?: string;
}

export interface OpenAPIServer {
    url: string;
    description?: string;
    variables?: Record<string, unknown>;
}

export interface OpenAPISchema {
    type?: string;
    format?: string;
    properties?: Record<string, OpenAPISchema>;
    items?: OpenAPISchema;
    required?: string[];
    example?: unknown;
    description?: string;
    enum?: unknown[];
    nullable?: boolean;
    default?: unknown;
    $ref?: string;
}

export interface OpenAPIMediaType {
    schema: OpenAPISchema;
    example?: unknown;
    examples?: Record<string, unknown>;
}

export interface OpenAPIResponse {
    description: string;
    content?: Record<string, OpenAPIMediaType>;
    headers?: Record<string, unknown>;
}

export interface OpenAPIParameter {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    schema: OpenAPISchema;
    example?: unknown;
}

export interface OpenAPIRequestBody {
    description?: string;
    required?: boolean;
    content: Record<string, OpenAPIMediaType>;
}

export interface OpenAPIOperation {
    summary?: string;
    description?: string;
    operationId?: string;
    tags?: string[];
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses: Record<string, OpenAPIResponse>;
    deprecated?: boolean;
    security?: Record<string, string[]>[];
}

export interface OpenAPIPath {
    get?: OpenAPIOperation;
    post?: OpenAPIOperation;
    put?: OpenAPIOperation;
    patch?: OpenAPIOperation;
    delete?: OpenAPIOperation;
    options?: OpenAPIOperation;
    head?: OpenAPIOperation;
    trace?: OpenAPIOperation;
}

export interface OpenAPIComponents {
    schemas?: Record<string, OpenAPISchema>;
    responses?: Record<string, OpenAPIResponse>;
    parameters?: Record<string, OpenAPIParameter>;
    requestBodies?: Record<string, OpenAPIRequestBody>;
    securitySchemes?: Record<string, unknown>;
    examples?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    links?: Record<string, unknown>;
    callbacks?: Record<string, unknown>;
}

export interface OpenAPIDocument {
    openapi: string;
    info: OpenAPIInfo;
    servers?: OpenAPIServer[];
    paths: Record<string, OpenAPIPath>;
    components?: OpenAPIComponents;
    security?: Record<string, string[]>[];
    tags?: Array<{ name: string; description?: string }>;
    externalDocs?: {
        description?: string;
        url: string;
    };
}

/**
 * HTTP Methods type
 */
export type HTTPMethod = "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "trace";
