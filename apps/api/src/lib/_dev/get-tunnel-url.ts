import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { logger } from "@/utils/logger/index";
import { env, updateEnv } from "../env";

const TUNNEL_URL_FILE = join(__dirname, "tunnel.local.txt");

export const getTunnelUrl = async () => {
  if (env.NODE_ENV !== "development") return;

  if (!existsSync(TUNNEL_URL_FILE)) {
    writeFile(TUNNEL_URL_FILE, "");
  }

  // Get the tunnel URL from the file
  const filePath = TUNNEL_URL_FILE;
  const tunnelUrl = await readFile(filePath, "utf-8");

  if (tunnelUrl) {
    // Ping the tunnel URL healthcheck endpoint
    try {
      const response = await fetch(`${tunnelUrl}/ping`);
      if (response.ok) {
        logger.info(`Tunnel URL is healthy: ${tunnelUrl}`);
        updateEnv({ key: "WEBHOOK_ENDPOINT", value: tunnelUrl });
        return tunnelUrl;
      }
    } catch (_) {}
  }

  // Create new temporary cloudflare tunnel for API

  const tunnel = spawn("cloudflared", ["tunnel", "--url", "http://localhost:4000"]);

  return new Promise<string>((resolve, reject) => {
    let tunnelUrl: string | null = null;

    const handleTunnelOutput = async (data: Buffer) => {
      const output = data.toString();

      // Only process if we haven't already captured a URL
      if (!tunnelUrl) {
        const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match) {
          tunnelUrl = match[0];
          logger.info(`Extracted tunnel URL: ${tunnelUrl}`);

          // Write tunnel URL to file
          try {
            await writeFile(TUNNEL_URL_FILE, tunnelUrl);
            logger.info(`Tunnel URL written to: ${TUNNEL_URL_FILE}`);
          } catch (error) {
            logger.error({ message: "Failed to write tunnel URL to file", error });
          }

          updateEnv({ key: "WEBHOOK_ENDPOINT", value: tunnelUrl });
          resolve(tunnelUrl);
        }
      }
    };

    tunnel.stdout.on("data", handleTunnelOutput);
    tunnel.stderr.on("data", handleTunnelOutput);

    tunnel.on("error", (error) => {
      console.error(`Failed to start tunnel: ${error}`);
      reject(error);
    });
  });
};
