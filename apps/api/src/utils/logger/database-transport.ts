import { db, systemLogs } from "@packages/database";
import dayjs from "dayjs";
import Transport from "winston-transport";

export class DatabaseTransport extends Transport {
  override async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      const { level, message, timestamp, ...metadata } = info;

      // Remove ANSI color codes from the message if it's a string
      // biome-ignore lint/suspicious/noControlCharactersInRegex: We're using a regex to remove ANSI color codes from the message
      const cleanMessage = typeof message === "string" ? message.replace(/\u001b\[\d+m/g, "") : message;

      const createdAt = dayjs(timestamp).toDate();

      await db.insert(systemLogs).values({
        level: level,
        message: typeof cleanMessage === "object" ? JSON.stringify(cleanMessage) : cleanMessage,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
        created_at: createdAt,
      });

      callback();
    } catch (err) {
      console.error("Error saving log to database:", err);
      callback();
    }
  }
}
