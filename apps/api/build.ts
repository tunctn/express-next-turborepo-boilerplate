import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { build } from "bun";

const run = async () => {
  try {
    const serverDir = import.meta.dir;
    const srcDir = join(serverDir, "src");
    const distDir = join(serverDir, "dist");
    const entryPoint = join(srcDir, "server.ts");

    // Check if directories and files exist
    if (!existsSync(srcDir)) {
      throw new Error(`Source directory does not exist: ${srcDir}`);
    }
    if (!existsSync(entryPoint)) {
      throw new Error(`Entry point file does not exist: ${entryPoint}`);
    }
    //

    // Create dist directory if it doesn't exist
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
      console.log("Created distribution directory:", distDir);
    }

    const result = await build({
      entrypoints: [entryPoint],
      outdir: distDir,
      minify: true,
      target: "node",
      // external: ["@node-rs/argon2", "sharp", "@ffprobe-installer/ffprobe", "@ffmpeg-installer/ffmpeg"],
    });

    if (result.success) {
      console.log("✅ Build successful!");
    } else {
      console.error("❌ Build failed:");
      for (const log of result.logs) {
        console.error(`${log.level}: ${log.message}`);
      }
    }
  } catch (error) {
    console.error("An error occurred during the build process:", error);
  }
};
await run();
