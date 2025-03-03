import { logger } from "@/utils/logger/index";
import chalk, { type ChalkInstance } from "chalk";
import type { NextFunction, Request, Response } from "express";
import onFinished from "on-finished";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
const LOG_METHODS: Record<Method, boolean> = {
  GET: true,
  POST: true,
  PUT: true,
  DELETE: true,
  PATCH: true,
  OPTIONS: false,
};

export function responseLogger(req: Request, res: Response, next: NextFunction) {
  const start = new Date();
  const method = req.method as Method;
  const url = req.url;

  let methodColor: ChalkInstance = chalk.dim;
  if (method === "GET") methodColor = chalk.green;
  else if (method === "POST") methodColor = chalk.blue;
  else if (method === "PUT") methodColor = chalk.yellow;
  else if (method === "DELETE") methodColor = chalk.red;
  else if (method === "PATCH") methodColor = chalk.magenta;
  else if (method === "OPTIONS") methodColor = chalk.cyan;

  onFinished(res, (_err, res) => {
    const responseTime = new Date().getTime() - start.getTime();
    const status = res.statusCode;

    let statusColor: ChalkInstance = chalk.dim;
    if (status) {
      if (status >= 500) statusColor = chalk.bgRed.bold;
      else if (status >= 400) statusColor = chalk.red;
      else statusColor = chalk.green;
    }

    let responseTimeColor: ChalkInstance = chalk.dim;
    if (responseTime) {
      if (responseTime >= 5000) responseTimeColor = chalk.bgRed.bold;
      else if (responseTime >= 2000) responseTimeColor = chalk.red;
      else if (responseTime >= 700) responseTimeColor = chalk.yellow;
      else responseTimeColor = chalk.dim;
    }

    const logString = [
      status ? `${statusColor(status)}` : "",
      methodColor(`${method}: ${url}`),
      `${chalk.dim("in")} ${responseTimeColor(`${responseTime}ms`)}`,
    ]
      .filter(Boolean)
      .join(" ");

    let finalLog = logString;
    if (method === "OPTIONS") finalLog = chalk.dim(logString);

    if (LOG_METHODS[method] === false) return;
    logger.info(finalLog);
  });

  next();
}
