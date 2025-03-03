import { existsSync, mkdirSync } from "node:fs";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import { logLevels } from "./log-levels";
import "./database-log-cleanup";
import { createScopedLogger } from "./create-scoped-logger";
import { DatabaseTransport } from "./database-transport";
import { logFormat } from "./log-format";

// logs dir
const logDir = `${__dirname}/../../../logs`;
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Apply colors to winston
winston.addColors(logLevels.colors);

const logger = winston.createLogger({
  levels: logLevels.levels,
  level: "silly",
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.json(),
    winston.format.splat(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    logFormat,
  ),
  transports: [
    new DatabaseTransport(),
    // debug log setting
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
}) as winston.Logger & Record<keyof (typeof logLevels)["levels"], winston.LeveledLogMethod>;

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize({ all: true })),
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { createScopedLogger, logger, stream };
