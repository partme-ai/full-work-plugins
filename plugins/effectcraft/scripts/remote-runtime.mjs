#!/usr/bin/env node
// Craft 的 Codex 轻量入口：首次启动时按发布摘要下载完整运行包。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const shell = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const release = JSON.parse(fs.readFileSync(path.join(shell, "runtime.json"), "utf8"));
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const parent = path.join(process.env.CRAFT_REMOTE_CACHE || path.join(codexHome, "craft-runtime"), release.name);
const cache = path.join(parent, release.version);
const packageRoot = path.join(cache, release.archiveRoot);

function ready() {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "plugin.json"), "utf8"));
    return manifest.name === release.name && manifest.version === release.version &&
      fs.statSync(path.join(packageRoot, "ui", "bootstrap.mjs")).isFile();
  } catch { return false; }
}

async function install() {
  if (ready()) return;
  fs.mkdirSync(parent, { recursive: true });
  const stage = fs.mkdtempSync(path.join(parent, ".download-"));
  try {
    const archive = path.join(stage, "release.zip");
    const response = await fetch(release.url);
    if (!response.ok || !response.body) throw new Error(`Craft release download failed: HTTP ${response.status}`);
    await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(archive));
    const digest = createHash("sha256").update(fs.readFileSync(archive)).digest("hex");
    if (digest !== release.sha256) throw new Error(`Craft release SHA-256 mismatch: ${release.name}`);
    const extracted = path.join(stage, "extracted");
    fs.mkdirSync(extracted);
    const unpack = spawnSync(process.platform === "win32" ? "python" : "python3",
      [path.join(shell, "scripts", "extract-release.py"), archive, extracted, release.archiveRoot],
      { encoding: "utf8" });
    if (unpack.status !== 0) throw new Error(`Craft release extraction failed: ${unpack.stderr}`);
    const manifest = JSON.parse(fs.readFileSync(path.join(extracted, release.archiveRoot, "plugin.json"), "utf8"));
    if (manifest.name !== release.name || manifest.version !== release.version) throw new Error("Craft release identity mismatch");
    fs.rmSync(archive);
    if (!ready()) {
      fs.rmSync(cache, { recursive: true, force: true });
      fs.renameSync(extracted, cache);
    }
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}

await install();
fs.cpSync(path.join(packageRoot, "skills"), path.join(shell, "skills"), { recursive: true, force: true });
const runtime = path.join(packageRoot, "ui", "bootstrap.mjs");
const child = spawn(process.execPath, [runtime], {
  cwd: packageRoot,
  env: {
    ...process.env,
    CLAUDE_PLUGIN_ROOT: packageRoot,
    CRAFT_PANEL_METADATA_FILE: path.join(packageRoot, ".zcode-plugin", "panel-meta.json"),
  },
  stdio: "inherit",
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
