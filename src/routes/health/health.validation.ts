/**
 * Health check validation schemas.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */

export const healthCheckSchema = {
    responses: {
        200: {
            description: "Service is healthy",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {
                                type: "string",
                                example: "ok",
                            },
                            timestamp: {
                                type: "string",
                                format: "date-time",
                                example: "2025-12-26T10:00:00.000Z",
                            },
                            uptime: {
                                type: "number",
                                description: "Server uptime in seconds",
                                example: 123.45,
                            },
                            message: {
                                type: "string",
                                example: "Service is healthy",
                            },
                        },
                        required: ["status", "timestamp", "uptime", "message"],
                    },
                },
            },
        },
    },
};
