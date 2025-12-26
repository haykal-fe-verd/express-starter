import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const connectDb = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

const disconnectDb = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
