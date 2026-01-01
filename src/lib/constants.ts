import z from "zod";

export const NOT_FOUND_SCHEMA = z.object({
    status: z.literal("error").meta({ description: "Response status", example: "error" }),
    message: z.string().meta({ description: "Error message", example: "Not found" }),
    errors: z
        .array(
            z.object({
                method: z.string().meta({ description: "HTTP method", example: "GET" }),
                path: z.string().meta({ description: "Request path", example: "/users/123" }),
                message: z.string().meta({ description: "Detailed error message", example: "Endpoint not found" }),
            })
        )
        .optional()
        .meta({ description: "Optional list of not found details" }),
});

export const INTERNAL_SERVER_ERROR_SCHEMA = z.object({
    status: z.literal("error").meta({ description: "Response status", example: "error" }),
    message: z.string().meta({ description: "Error message", example: "Internal server error" }),
    errors: z
        .array(
            z.object({
                message: z
                    .string()
                    .meta({ description: "Detailed error message", example: "Database connection failed" }),
            })
        )
        .optional()
        .meta({ description: "Optional list of internal errors (avoid exposing sensitive details)" }),
});

export const UNPROCESSABLE_ENTITY_SCHEMA = z.object({
    status: z.literal("error").meta({ description: "Response status", example: "error" }),
    message: z.string().meta({ description: "Error message", example: "Validation failed" }),
    errors: z
        .array(
            z.object({
                where: z
                    .string()
                    .meta({ description: "Error location (body, query, params, headers)", example: "body" }),
                path: z.string().meta({ description: "Field path that caused the error", example: "email" }),
                message: z.string().meta({ description: "Detailed error message", example: "Invalid email format" }),
            })
        )
        .meta({ description: "Array of validation errors" }),
});
