/**
 * Database Module
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "@/application/logging";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    adapter,
    log: [
        {
            emit: "stdout",
            level: "query",
        },
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});

prisma.$on("error", (e) => {
    logger.error(e);
});

prisma.$on("warn", (e) => {
    logger.warn(e);
});

prisma.$on("info", (e) => {
    logger.info(e);
});

prisma.$on("query", (e) => {
    logger.info(e);
});

/**
 * Connect to the database.
 * @author Muhammad Haykal
 * @date 2025-12-28
 *
 * @returns {Promise<void>}
 */
const connectDb = async () => {
    try {
        logger.info({ tag: "DB", message: "Connecting to database..." });
        await prisma.$connect();
        logger.info({ tag: "DB", message: "Database connected successfully" });
    } catch (error) {
        logger.error("Database connection failed:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

/**
 * Disconnect from the database.
 * @author Muhammad Haykal
 * @date 2025-12-28
 *
 * @returns {Promise<void>}
 */
const disconnectDb = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
