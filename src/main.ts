import dotenv from "dotenv";

dotenv.config();

import env from "@/application/env";
import createApp from "@/application/create-app";
import { logger } from "@/application/logging";
import { connectDb, disconnectDb } from "@/application/database";
import { healthRoutes, homeRoutes } from "@/routes";
import { displayRegisteredRoutes } from "@/lib/route-utils";
import notFound from "@/middleware/not-found";
import onError from "@/middleware/on-error";

async function startServer() {
    try {
        // Connect to Database
        await connectDb();

        // create Express app
        const app = createApp();

        // Register routes
        app.use("/", homeRoutes());
        app.use("/api", healthRoutes());

        // 404 Handler (harus setelah semua routes)
        app.use(notFound);

        // Error Handler (harus paling terakhir)
        app.use(onError);

        // Display registered routes
        displayRegisteredRoutes();

        app.listen(env.PORT, () => {
            logger.info(`🚀 Server is running on port ${env.PORT}`);
            logger.info(`🏠 Home page at http://localhost:${env.PORT}`);
            logger.info(`📚 API Docs available at http://localhost:${env.PORT}/api/docs`);
            logger.info(`🔍 Health check at http://localhost:${env.PORT}/api/health`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        await disconnectDb();
        process.exit(1);
    }
}

startServer();
