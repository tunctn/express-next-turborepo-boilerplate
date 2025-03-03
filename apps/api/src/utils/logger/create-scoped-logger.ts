import type winston from "winston";
import { logger } from ".";

// Add this new interface
interface ScopedLogger {
  [key: string]: any;
  error: winston.LeveledLogMethod;
  warn: winston.LeveledLogMethod;
  success: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  verbose: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
  silly: winston.LeveledLogMethod;
  scope: (scopeName: string) => ScopedLogger;
}

export const createScopedLogger = (scope: string[] = []): ScopedLogger => {
  const logWithScope =
    (level: string) =>
    (message: string | object, ...meta: any[]): winston.Logger => {
      const scopePrefix = scope.length > 0 ? `${scope.join(":")}` : "";

      const winstonLogger = logger[level as keyof winston.Logger];

      if (typeof message === "string" && !meta.length) {
        return winstonLogger(`[${scopePrefix}]: ${message}`);
      }

      let metas = {};
      for (const metaItem of meta) {
        metas = { ...metas, ...metaItem };
      }

      if (typeof message === "string") {
        return winstonLogger(`[${scopePrefix}]: ${message}`, { ...metas });
      }

      return winstonLogger({ scope: scopePrefix, message: message, ...metas });
    };

  const scopedLogger: ScopedLogger = {
    error: logWithScope("error"),
    warn: logWithScope("warn"),
    success: logWithScope("success"),
    info: logWithScope("info"),
    http: logWithScope("http"),
    verbose: logWithScope("verbose"),
    debug: logWithScope("debug"),
    silly: logWithScope("silly"),
    scope: (scopeName: string) => createScopedLogger([...scope, scopeName]),
  };

  return scopedLogger;
};
