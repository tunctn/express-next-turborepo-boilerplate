import { type LogLevel, and, db, eq, lte, systemLogs } from "@packages/database";
import { logger } from ".";

interface CleanupOldLogsOptions {
  errorDays: number;
  warnDays: number;
  successDays: number;
  infoDays: number;
  httpDays: number;
  verboseDays: number;
  debugDays: number;
  sillyDays: number;
}

// Add this function after the DatabaseTransport class
export const cleanupOldLogs = async ({
  errorDays,
  warnDays,
  successDays,
  infoDays,
  httpDays,
  verboseDays,
  debugDays,
  sillyDays,
}: CleanupOldLogsOptions) => {
  const doCleanUp = async (level: LogLevel, days: number) => {
    try {
      // Only delete non-critical logs (everything except warn and error)
      const keepLogsUntil = new Date();
      keepLogsUntil.setDate(keepLogsUntil.getDate() - days); // keep logs for 180 days

      await db.delete(systemLogs).where(and(lte(systemLogs.created_at, keepLogsUntil), eq(systemLogs.level, level)));
    } catch (err) {
      console.error("Error cleaning up old logs:", err);
    }
  };

  await Promise.all([
    doCleanUp("error", errorDays),
    doCleanUp("warn", warnDays),
    doCleanUp("success", successDays),
    doCleanUp("info", infoDays),
    doCleanUp("http", httpDays),
    doCleanUp("verbose", verboseDays),
    doCleanUp("debug", debugDays),
    doCleanUp("silly", sillyDays),
  ]);
};

interface StartLogCleanupIntervalOptions extends CleanupOldLogsOptions {
  intervalHours: number;
}

export const startLogCleanupInterval = ({
  intervalHours,
  errorDays,
  warnDays,
  successDays,
  infoDays,
  httpDays,
  verboseDays,
  debugDays,
  sillyDays,
}: StartLogCleanupIntervalOptions) => {
  // Run immediately on start
  cleanupOldLogs({ errorDays, warnDays, successDays, infoDays, httpDays, verboseDays, debugDays, sillyDays }).catch((err) =>
    logger.error("Failed to cleanup logs:", err),
  );

  // Then run every intervalHours
  const interval = setInterval(cleanupOldLogs, intervalHours * 60 * 60 * 1000);
  return interval;
};
