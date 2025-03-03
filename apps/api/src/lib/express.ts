import { createServer as createHttpServer } from "node:http";
import { CORS_OPTIONS } from "@/config/cors";
import { ErrorMiddleware } from "@/middlewares/error.middleware";
import { responseLogger } from "@/middlewares/response-logger.middleware";
import { v1Routes } from "@/v1/routes";
import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import express from "express";
import type { Request } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { auth } from "./auth";

export type AppRequest = Request & { rawBody: Buffer; arrayBuffer?: ArrayBufferLike };

dayjs.extend(utc);

export function createServer() {
  const app = express();

  // Middlewares
  app.use(responseLogger);
  app.use(cors(CORS_OPTIONS));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());

  app.all("/v1/auth/*", toNodeHandler(auth));

  app.use((req, res, next) => {
    const chunks: Uint8Array[] = [];
    let bodySize = 0;
    const contentType = req.headers["content-type"] || "";
    const maxBodySize = contentType.includes("video/")
      ? 100 * 1024 * 1024 // 100MB for videos
      : contentType.includes("audio/")
        ? 50 * 1024 * 1024 // 50MB for audio
        : contentType.includes("image/") || contentType.includes("application/pdf")
          ? 25 * 1024 * 1024 // 25MB for images/PDFs
          : 1024 * 1024 * 10; // 10MB for everything else

    req.on("data", (chunk) => {
      bodySize += chunk.length;
      if (bodySize > maxBodySize) {
        res.status(413).json({ error: "Payload too large" });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const rawBody = Buffer.concat(chunks);
      let body: any = rawBody.toString("utf8");

      // Handle different content types
      const contentType = req.headers["content-type"];
      if (contentType) {
        if (contentType.includes("application/json")) {
          try {
            body = JSON.parse(body);
          } catch {
            // Keep as string if parsing fails
          }
        } else if (
          contentType.includes("application/octet-stream") ||
          contentType.includes("application/pdf") ||
          contentType.includes("image/") ||
          contentType.includes("audio/") ||
          contentType.includes("video/")
        ) {
          body = rawBody.buffer;
          (req as AppRequest).arrayBuffer = rawBody.buffer;
        }
      }

      (req as AppRequest).rawBody = rawBody;
      (req as AppRequest).body = body;
      next();
    });

    req.on("error", (err) => {
      next(err);
    });
  });

  // Continue with other middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser("cookie-parser"));

  app.set("json spaces", 0);

  // Error handler
  app.use(ErrorMiddleware);

  // Health check
  app.use("/ping", (_, res) => {
    res.status(200).json({ message: "OK" });
  });

  // Routes
  v1Routes.forEach(({ router, path }) => app.use(`/v1${path}`, router));

  const server = createHttpServer(app);

  return { app, server };
}
