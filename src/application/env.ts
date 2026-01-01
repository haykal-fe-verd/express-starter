/**
 * Environment Module
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import "dotenv/config";
import z from "zod";

const EnvSchema = z.object({
    // APP
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().default(8000),
    LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
    LOG_RETENTION: z.string().default("30d"),
    ALLOWED_ORIGINS: z.string(),

    // DATABASE
    DATABASE_URL: z.string(),

    // MAIL
    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_SECURE: z.coerce.boolean().default(false),
    MAIL_USER: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string(),

    // REDIS
    REDIS_URL: z.string().default("redis://localhost:6379"),

    // JWT
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("7d"),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid environment variables:", {
        errors: error.flatten().fieldErrors,
    });
    process.exit(1);
}

export default env as env;
