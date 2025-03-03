import { logger } from "@/utils/logger";

// Dayjs settings
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { env } from "@/lib/env";
// V1
import { migrateDb } from "@packages/database";

dayjs.extend(utc);

import { getTunnelUrl } from "@/lib/_dev/get-tunnel-url";
import { setupStripeWebhook } from "@/lib/_dev/setup-stripe-webhook";
import { createServer } from "@/lib/express";
import { redisManager } from "@/lib/redis";
import { setupSocket } from "@/lib/socket";
import { startLogCleanupInterval } from "@/utils/logger/database-log-cleanup";
import { clearTmpFolder } from "@/utils/tmp";

const PORT = Number(process.env["PORT"]) || 4000;

async function startServer() {
  // Create express app and server
  const { server } = createServer();

  // Setup socket with the server instance
  setupSocket(server);

  server.listen(PORT, async () => {
    try {
      // Dev utils
      await getTunnelUrl();
      await setupStripeWebhook();
      await clearTmpFolder();

      // Database
      await migrateDb({
        log: logger.info,
        connection: {
          name: env.DB_NAME,
          user: env.DB_USER,
          password: env.DB_PASSWORD,
          host: env.DB_HOST,
          port: env.DB_PORT,
          ssl: env.DB_SSL,
        },
      });

      // Logging
      startLogCleanupInterval({
        intervalHours: 24,

        errorDays: 180,
        warnDays: 180,
        successDays: 90,
        infoDays: 30,
        httpDays: 30,
        verboseDays: 30,
        debugDays: 7,
        sillyDays: 7,
      });

      // Initialize Redis
      await redisManager.initialize();

      logger.success(`🚀 App listening on the port ${PORT}!`);
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  });

  // Handle graceful shutdown
  async function shutdown(signal: string) {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(() => {
      logger.info("HTTP server closed");
    });

    try {
      await redisManager.gracefulShutdown();

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  }

  // Listen for shutdown signals
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
