#!/usr/bin/env node
// Codex 的本地市场只从本地插件包解析 logo；将已发布插件的运行文件同步到市场仓。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..", "full-work-plugins-repositories");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const write = process.argv.includes("--write");
const files = [
  "plugin.json", ".codex-plugin/plugin.json", ".claude-plugin/plugin.json",
  ".zcode-plugin/plugin.json", ".agents/plugins/marketplace.json",
  "kimi.plugin.json", "LICENSE", "README.md", "README.en.md",
  "THIRD-PARTY-NOTICES.md"
];
const dirs = ["assets", "skills"];
const portable = (relative) => relative.split(path.sep).join("/");

function walk(base) {
  const out = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const full = path.join(base, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

for (const plugin of catalog.plugins) {
  const source = path.join(workspace, plugin.localDirectory);
  const target = path.join(root, "plugins", plugin.id);
  const head = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const tag = execFileSync("git", ["-C", source, "rev-list", "-n", "1", `v${plugin.version}`], { encoding: "utf8" }).trim();
  if (head !== tag) throw new Error(`${plugin.id}: source checkout is not v${plugin.version}`);
  const entries = [
    ...files,
    ...dirs.flatMap((dir) => walk(path.join(source, dir)).map((file) => portable(path.relative(source, file))))
  ];
  const content = (relative) => {
    const original = fs.readFileSync(path.join(source, relative));
    if (relative.endsWith(".png")) return original;
    const normalized = original.toString("utf8").replace(/\r\n/g, "\n");
    if (!["plugin.json", ".codex-plugin/plugin.json"].includes(relative)) return Buffer.from(normalized);
    const manifest = JSON.parse(normalized);
    const ui = relative === "plugin.json"
      ? manifest.extensions["com.openai"].interface
      : manifest.interface;
    ui.displayName = plugin.localizations["zh-CN"].displayName;
    ui.shortDescription = plugin.localizations["zh-CN"].shortDescription;
    return Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  };
  if (write) {
    fs.rmSync(target, { recursive: true, force: true });
    for (const relative of entries) {
      const destination = path.join(target, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, content(relative));
    }
  } else {
    const actual = fs.existsSync(target) ? walk(target).map((file) => portable(path.relative(target, file))).sort() : [];
    const expected = [...entries].sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${plugin.id}: bundled file list differs from published package`);
    }
    for (const relative of entries) {
      const actualContent = fs.readFileSync(path.join(target, relative));
      const comparable = relative.endsWith(".png")
        ? actualContent
        : Buffer.from(actualContent.toString("utf8").replace(/\r\n/g, "\n"));
      if (!content(relative).equals(comparable)) {
        throw new Error(`${plugin.id}: bundled ${relative} differs from published package`);
      }
    }
  }
}
console.log(`${write ? "Synchronized" : "Validated"} ${catalog.plugins.length} Codex local plugin bundles.`);
