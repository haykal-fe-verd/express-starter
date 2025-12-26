import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { logger } from "@/application/logging";
import env from "@/application/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

/**
 * Create a Prisma Client instance.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {PrismaClient}
 */
const prisma = new PrismaClient({
    adapter,
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});

/**
 * Connect to the database.
 * @author Muhammad Haykal
 *
 * @date 2025-12-26
 *
 * @returns {Promise<void>}
 */
const connectDb = async () => {
    try {
        await prisma.$connect();
        logger.info("Database connected successfully");
    } catch (error) {
        logger.error("Database connection failed:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

/**
 * Disconnect from the database.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @returns {Promise<void>}
 */
const disconnectDb = async () => {
    await prisma.$disconnect();
};

/**
 * Prisma Client event listeners for logging.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
prisma.$on("error", (e) => {
    logger.error(e);
});

/**
 * Prisma Client event listeners for logging.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
prisma.$on("warn", (e) => {
    logger.warn(e);
});

/**
 * Prisma Client event listeners for logging.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
prisma.$on("info", (e) => {
    logger.info(e);
});

/**
 * Prisma Client event listeners for logging.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
prisma.$on("query", (e) => {
    logger.info(e);
});

/**
 * Gracefully handle application termination to close database connection.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
process.on("SIGINT", async () => {
    logger.info("SIGINT received, closing database connection...");
    await disconnectDb();
    process.exit(0);
});

/**
 * Gracefully handle application termination to close database connection.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */
process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, closing database connection...");
    await disconnectDb();
    process.exit(0);
});

export { prisma, connectDb, disconnectDb };
