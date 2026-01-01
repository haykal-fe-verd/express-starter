/**
 * Logging Module
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import env from "@/application/env";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const logDir = path.join(process.cwd(), "storage", "logs");
const timestamp = format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" });
const json = format.json();

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const errorTransport = new DailyRotateFile({
    level: "error",
    dirname: logDir,
    filename: "error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: env.LOG_RETENTION,
});

const appTransport = new DailyRotateFile({
    level: (env.LOG_LEVEL as keyof typeof levels) || (env.NODE_ENV === "production" ? "info" : "debug"),
    dirname: logDir,
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: env.LOG_RETENTION,
});

const consoleTransport = new transports.Console({
    level: env.NODE_ENV === "production" ? "http" : "debug",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        format.printf(({ level, message, timestamp, ...meta }) => {
            const color =
                level === "error"
                    ? chalk.red
                    : level === "warn"
                    ? chalk.yellow
                    : level === "info"
                    ? chalk.blue
                    : level === "http"
                    ? chalk.green
                    : chalk.gray;
            const time = chalk.white(`[${timestamp}]`);
            const lvl = color(level.toUpperCase());
            const msg = typeof message === "string" ? message : JSON.stringify(message);
            const ctx = Object.keys(meta).length ? chalk.dim(JSON.stringify(meta)) : "";
            return `${time} ${lvl} ${msg}${ctx ? ` ${ctx}` : ""}`;
        })
    ),
});

const logger = createLogger({
    levels,
    level: (env.LOG_LEVEL as keyof typeof levels) || (env.NODE_ENV === "production" ? "info" : "debug"),
    format: format.combine(timestamp, json),
    transports: [errorTransport, appTransport, consoleTransport],
});

/**
 * Masks sensitive information from an object.
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @param {Record<string, unknown>} obj
 *
 * @returns {Record<string, unknown>}
 */
const maskSensitive = (obj: Record<string, unknown>) => {
    const clone: Record<string, unknown> = {};
    for (const k of Object.keys(obj || {})) {
        const key = k.toLowerCase();
        if (["password", "authorization", "cookie", "set-cookie", "token"].includes(key)) continue;
        clone[k] = obj[k];
    }
    return clone;
};

export { logger, maskSensitive };
