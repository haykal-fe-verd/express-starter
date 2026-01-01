/**
 * Redis Module
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import { createClient } from "redis";
import env from "@/application/env";
import { logger } from "@/application/logging";

export type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

/**
 * Initialize Redis client
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @returns {Promise<RedisClient>}
 */
export async function initRedis(): Promise<RedisClient> {
    if (redisClient) {
        return redisClient;
    }

    redisClient = createClient({
        url: env.REDIS_URL,
    });

    redisClient.on("error", (err: Error) => {
        logger.error({ tag: "REDIS", message: "Redis Error", error: err });
    });

    redisClient.on("connect", () => {
        logger.info({ tag: "REDIS", message: "Connecting to redis..." });
    });

    redisClient.on("ready", () => {
        logger.info({ tag: "REDIS", message: "Redis connected successfully" });
    });

    redisClient.on("reconnecting", () => {
        logger.warn({ tag: "REDIS", message: "Redis reconnecting..." });
    });

    redisClient.on("end", () => {
        logger.info({ tag: "REDIS", message: "Redis disconnected" });
    });

    await redisClient.connect();

    return redisClient;
}

/**
 * Get Redis client instance
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @returns {RedisClient}
 */
export function getRedis(): RedisClient {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call initRedis() first.");
    }
    return redisClient;
}

/**
 * Close Redis connection
 * @author Muhammad Haykal
 * @date 2025-12-27
 *
 * @returns {Promise<void>}
 */
export async function closeRedis(): Promise<void> {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info({ tag: "REDIS", message: "Redis connection closed" });
    }
}

/**
 * Cache helper functions
 */
export const cache = {
    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        const client = getRedis();
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    },

    /**
     * Set value to cache
     */
    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        const client = getRedis();
        const serialized = JSON.stringify(value);
        if (ttlSeconds) {
            await client.setEx(key, ttlSeconds, serialized);
        } else {
            await client.set(key, serialized);
        }
    },

    /**
     * Delete key from cache
     */
    async del(key: string): Promise<void> {
        const client = getRedis();
        await client.del(key);
    },

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        const client = getRedis();
        const result = await client.exists(key);
        return result === 1;
    },

    /**
     * Get multiple keys
     */
    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        const client = getRedis();
        const values = await client.mGet(keys);
        return values.map((v: string | null) => (v ? JSON.parse(v) : null));
    },

    /**
     * Delete keys by pattern
     */
    async delPattern(pattern: string): Promise<void> {
        const client = getRedis();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(keys);
        }
    },

    /**
     * Get TTL of a key
     */
    async ttl(key: string): Promise<number> {
        const client = getRedis();
        return await client.ttl(key);
    },

    /**
     * Set expiration on a key
     */
    async expire(key: string, seconds: number): Promise<void> {
        const client = getRedis();
        await client.expire(key, seconds);
    },
};
