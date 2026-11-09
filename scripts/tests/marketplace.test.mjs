import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const catalog = read("catalog.json");

test("office releases and Craft candidates have one owner and pinned sources", () => {
  const published = new Set(catalog.plugins.map((plugin) => plugin.id));
  const candidates = new Set();
  for (const candidate of catalog.candidatePlugins ?? []) {
    assert.ok(!published.has(candidate.id), `${candidate.id}: candidate is published`);
    assert.ok(!candidates.has(candidate.id), `${candidate.id}: duplicate candidate`);
    candidates.add(candidate.id);
    assert.equal(candidate.status, "release_candidate_installable");
    assert.equal(candidate.line, "full-work");
    assert.equal(candidate.repository, `full-aigc-plugins/${candidate.localDirectory}`);
  }
  for (const [file, key] of [
    [".agents/plugins/marketplace.json", "name"],
    ["marketplace.json", "name"],
    ["kimi-marketplace.json", "id"],
    ["cn-marketplace/marketplace.json", "name"],
    ["atomgit-marketplace/marketplace.json", "name"],
  ]) {
    const actual = new Set(read(file).plugins.map((plugin) => plugin[key]));
    assert.deepEqual(actual, new Set([...published, ...candidates]), file);
  }
  for (const plugin of catalog.plugins) {
    for (const file of ["cn-marketplace/marketplace.json", "atomgit-marketplace/marketplace.json"]) {
      const entry = read(file).plugins.find((item) => item.name === plugin.id);
      assert.equal(entry.source.url, `https://github.com/${plugin.repository}.git`);
      assert.equal(entry.source.ref, `v${plugin.version}`);
      assert.ok(entry.icon.startsWith(`https://cdn.jsdelivr.net/gh/${plugin.repository}@v${plugin.version}/`));
    }
  }
  for (const candidate of catalog.candidatePlugins) {
    const card = read(".agents/plugins/marketplace.json").plugins.find(item => item.name === candidate.id);
    assert.deepEqual(card.source, { source: "url", url: `https://github.com/${candidate.repository}.git`, ref: `v${candidate.version}` });
    assert.equal(card.interface.displayName, candidate.localizations["zh-CN"].displayName);
    assert.equal(card.interface.logo, `https://cdn.jsdelivr.net/gh/${candidate.repository}@v${candidate.version}/${candidate.logo}`);
    assert.ok(!fs.existsSync(path.join(root, "plugins", candidate.id)));
  }
});

test("Codex office cards use Chinese names, descriptions, and brand icons", () => {
  const cards = read(".agents/plugins/marketplace.json").plugins;
  assert.equal(cards.length, 13);
  for (const plugin of catalog.plugins) {
    const card = cards.find((item) => item.name === plugin.id);
    assert.ok(card, plugin.id);
    assert.equal(card.interface.displayName, plugin.localizations["zh-CN"].displayName);
    assert.equal(card.interface.shortDescription, plugin.localizations["zh-CN"].shortDescription);
    assert.equal(card.description, plugin.localizations["zh-CN"].description);
    assert.equal(card.icon, `https://cdn.jsdelivr.net/gh/${plugin.repository}@v${plugin.version}/assets/logo.png`);
    assert.equal(card.interface.logo, card.icon);
    assert.deepEqual(card.source, { source: "local", path: `./plugins/${plugin.id}` });
    const bundle = path.join(root, "plugins", plugin.id);
    const manifest = JSON.parse(fs.readFileSync(path.join(bundle, "plugin.json"), "utf8"));
    const ui = manifest.extensions["com.openai"].interface;
    assert.equal(ui.displayName, plugin.localizations["zh-CN"].displayName);
    assert.equal(ui.shortDescription, plugin.localizations["zh-CN"].shortDescription);
    assert.ok(fs.statSync(path.join(bundle, "assets", "logo.png")).size > 0);
  }
});

test("local ZCode distribution embeds office packages and leaves Craft remote", () => {
  const distribution = read("dist/local-marketplace/marketplace.json");
  for (const plugin of catalog.plugins) {
    const entry = distribution.plugins.find(item => item.name === plugin.id);
    assert.equal(entry.source, `./plugins/${plugin.id}`);
    assert.ok(fs.existsSync(path.join(root, "dist/local-marketplace/plugins", plugin.id, "plugin.json")));
  }
  for (const plugin of catalog.candidatePlugins) {
    const entry = distribution.plugins.find(item => item.name === plugin.id);
    assert.equal(entry.source.source, "url");
    assert.ok(!fs.existsSync(path.join(root, "dist/local-marketplace/plugins", plugin.id)));
  }
});
