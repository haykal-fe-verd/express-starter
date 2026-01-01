/**
 * Main entry point of the application.
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import express from "express";
import { connectDb, disconnectDb } from "@/application/database";
import env from "@/application/env";
import { logger } from "@/application/logging";
import { closeRedis, initRedis } from "@/application/redis";
import { registerModules } from "@/application/route";
import { setupScalarDocs } from "@/application/scalar";
import { httpLogger } from "@/middleware/http-logger";
import notFound from "@/middleware/not-found";
import onError from "@/middleware/on-error";
import serveEmojiFavicon from "@/middleware/serve-emoji-favicon";

async function startServer() {
    try {
        // Connect to Database
        await connectDb();

        // Initialize Redis
        await initRedis();

        const app = express();

        // HTTP request logger
        app.use(httpLogger);

        // Parse JSON request bodies
        app.use(express.json());

        // Parse URL-encoded request bodies
        app.use(express.urlencoded({ extended: true }));

        // Serve emoji favicon
        app.use(serveEmojiFavicon("🚀"));

        // register routes from modules
        registerModules(app, true);

        // Setup Scalar API documentation
        setupScalarDocs(app);

        // 404 Handler (harus setelah semua routes)
        app.use(notFound);

        // Error Handler (harus paling terakhir)
        app.use(onError);

        app.listen(env.PORT, () => {
            logger.info(`Health check available at http://localhost:${env.PORT}/health`);
            logger.info(`Documentation available at http://localhost:${env.PORT}/docs`);
            logger.info(`Server is running at http://localhost:${env.PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on("SIGINT", async () => {
    logger.info("Shutting down gracefully...");
    await disconnectDb();
    await closeRedis();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("Shutting down gracefully...");
    await disconnectDb();
    await closeRedis();
    process.exit(0);
});

startServer();
