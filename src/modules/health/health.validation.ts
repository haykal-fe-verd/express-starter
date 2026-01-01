/**
 * Health Validation Module
 * @author Muhammad Haykal
 * @date 2025-12-31
 */

import z from "zod";

//! ========== Response Schemas ==========
export const healthDataSchema = z.object({
    status: z.string().meta({ description: "Health status of the service", example: "ok" }),
    timestamp: z.string().datetime().meta({ description: "Current server timestamp", example: "2025-12-31T10:00:00Z" }),
    uptime: z.number().meta({ description: "Server uptime in seconds", example: 3600 }),
});

export const healthResponseSchema = z.object({
    status: z.literal("success").meta({ description: "Response status", example: "success" }),
    data: healthDataSchema.meta({ description: "Health check data" }),
});

//! ========== Types ==========
export type HealthData = z.infer<typeof healthDataSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
