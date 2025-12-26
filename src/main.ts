import env from "@/application/env";
import { web } from "@/application/web";
import { logger } from "@/application/logging";
import { connectDb, disconnectDb } from "@/application/database";
import "@/application/doc";

async function startServer() {
    try {
        // Connect to Database
        await connectDb();

        web.listen(env.PORT, () => {
            logger.info(`🚀 Server is running on port ${env.PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        await disconnectDb();
        process.exit(1);
    }
}

startServer();
