import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const catalog = read("catalog.json");

test("candidate plugins remain separate from public host catalogs", () => {
  const published = new Set(catalog.plugins.map((plugin) => plugin.id));
  const candidates = new Set();
  for (const candidate of catalog.candidatePlugins ?? []) {
    assert.ok(!published.has(candidate.id), `${candidate.id}: candidate is published`);
    assert.ok(!candidates.has(candidate.id), `${candidate.id}: duplicate candidate`);
    candidates.add(candidate.id);
    assert.equal(candidate.status, "local_candidate");
    assert.equal(candidate.line, "full-work");
  }
  for (const [file, key] of [
    [".agents/plugins/marketplace.json", "name"],
    ["marketplace.json", "name"],
    ["kimi-marketplace.json", "id"],
    ["cn-marketplace/marketplace.json", "name"],
    ["atomgit-marketplace/marketplace.json", "name"],
  ]) {
    const actual = new Set(read(file).plugins.map((plugin) => plugin[key]));
    assert.deepEqual(actual, published, file);
  }
  for (const plugin of catalog.plugins) {
    for (const file of ["cn-marketplace/marketplace.json", "atomgit-marketplace/marketplace.json"]) {
      const entry = read(file).plugins.find((item) => item.name === plugin.id);
      assert.equal(entry.source.url, `https://github.com/${plugin.repository}.git`);
      assert.equal(entry.source.ref, `v${plugin.version}`);
      assert.ok(entry.icon.startsWith(`https://cdn.jsdelivr.net/gh/${plugin.repository}@v${plugin.version}/`));
    }
  }
});
