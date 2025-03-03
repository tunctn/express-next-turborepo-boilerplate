import { logger } from "@/utils/logger";
import Redis, { type RedisOptions } from "ioredis";
import { env } from "./env";

export const REDIS_CONFIG: RedisOptions = {
  host: env.REDIS_HOST,
  port: Number.parseInt(env.REDIS_PORT),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
};

class RedisManager {
  private static instance: RedisManager;
  private client: Redis | null = null;
  private isShuttingDown = false;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async initialize(callback?: () => void): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    logger.info("Initializing Redis...");

    this.client = new Redis(REDIS_CONFIG);
    this.client.on("error", (error) => {
      logger.error("Redis connection error:", error);
    });
    this.client.on("connect", () => {
      logger.success("Redis connected");
      callback?.();
    });
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error("Please initialize the Redis client first.");
    }
    return this.client;
  }

  public async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    logger.info("Initiating graceful shutdown of Redis manager...");

    if (this.client) {
      try {
        await this.client.quit();
        logger.info("Redis connection closed gracefully");
      } catch (error) {
        logger.error("Error during Redis shutdown:", error);
        // Force disconnect if quit fails
        this.client.disconnect();
      }
      this.client = null;
    }

    logger.info("Redis manager shutdown complete");
  }
}

export const redisManager = RedisManager.getInstance();
