import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { env } from "@/lib/env";
import { logger } from "@/utils/logger/index";
import { newId } from "@packages/shared";
import dayjs from "dayjs";

const TMP_FOLDER = path.join(os.tmpdir(), "x10d");

export const saveToTemporaryFile = async ({
  data,
  dir = ["tmp"],
  name = `${newId(6)}-${dayjs().format("YYYY-MM-DD-HHmmss")}.json`,
  loggerPrefix,
}: {
  data: string | object;
  dir?: string[];
  name?: string;
  loggerPrefix?: string;
}) => {
  if (env.NODE_ENV !== "development") return;

  const randomId = newId(6);
  const timestamp = dayjs().format("YYYY-MM-DD-HHmmss");
  let fileName = "";

  fileName = `${randomId}-${timestamp}-${name}`;

  const tmpFolder = path.join(TMP_FOLDER, ...dir);
  // Create the directory if it doesn't exist
  await fs.mkdir(path.join(tmpFolder), { recursive: true });

  const tmpFilePath = path.join(tmpFolder, fileName);
  let newData = data;
  if (typeof data === "object") {
    newData = JSON.stringify(data, null, 2);
  }

  await fs.writeFile(tmpFilePath, newData.toString());

  logger.debug(`${loggerPrefix} Saved tmp file: ${tmpFilePath}`);

  return tmpFilePath;
};

export const clearTmpFolder = async () => {
  try {
    await fs.rm(TMP_FOLDER, { recursive: true, force: true });
  } catch (_) {
    // Ignore if folder doesn't exist
  }
};
