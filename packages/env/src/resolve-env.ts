import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

export const resolveEnvs = () => {
  const upFolderSyntax = "../";
  const folderDepth = 10;
  const dir = __dirname;

  const checkedFilePaths: string[] = [];
  const foundFilePaths: string[] = [];

  let found = false;
  for (let i = 0; i < folderDepth; i++) {
    const createUpFolderSyntax = upFolderSyntax.repeat(i);
    const folderPath = resolve(dir, createUpFolderSyntax);
    const nodeEnv = process.env["NODE_ENV"];

    // Check if this is the root directory by looking for pnpm-workspace.yaml
    const workspaceFilePath = resolve(folderPath, "pnpm-workspace.yaml");
    const isRootDirectory = existsSync(workspaceFilePath);
    if (!isRootDirectory) {
      continue;
    }

    const baseEnvPath = resolve(folderPath, ".env");
    const localEnvPath = resolve(folderPath, ".env.local");
    const nodeEnvPath = resolve(folderPath, `.env.${nodeEnv}`);

    if (existsSync(baseEnvPath)) {
      config({ path: baseEnvPath });
      found = true;
      foundFilePaths.push(baseEnvPath);
    }
    if (existsSync(nodeEnvPath)) {
      config({ path: nodeEnvPath });
      found = true;
      foundFilePaths.push(nodeEnvPath);
    }
    if (existsSync(localEnvPath)) {
      config({ path: localEnvPath });
      found = true;
      foundFilePaths.push(localEnvPath);
    }

    checkedFilePaths.push(baseEnvPath);
    checkedFilePaths.push(nodeEnvPath);
    checkedFilePaths.push(localEnvPath);

    // If we've found the root directory, no need to continue searching up
    if (isRootDirectory) {
      break;
    }
  }

  if (found === false) {
    console.error("Failed to resolve envs. There is no .env file in the project.", { checked_file_paths: checkedFilePaths });
  }
};
