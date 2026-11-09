#!/usr/bin/env python3
"""验证本地办公插件候选包与目录的一致性。"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent / 'full-work-plugins-repositories'
catalog = json.loads((ROOT / 'catalog.json').read_text())
catalog_only = '--catalog-only' in sys.argv[1:]
assert set(sys.argv[1:]) <= {'--catalog-only'}, 'unsupported argument'
seen = set()
published = {entry['id'] for entry in catalog['plugins']}
for plugin in catalog['candidatePlugins']:
    name = plugin['id']
    assert name not in seen, f'duplicate plugin {name}'
    seen.add(name)
    assert name not in published, f'{name}: candidate is published'
    assert plugin['status'] == 'local_candidate'
    assert plugin['line'] == 'full-work'
    assert plugin['repository'] == f'full-work-plugins/{plugin["localDirectory"]}'
    assert plugin['componentTypes'] == ['skills']
    for field in ('displayName', 'description', 'shortDescription'):
        assert plugin[field] and plugin['localizations']['zh-CN'][field], (name, field)
    if catalog_only:
        continue
    repo = WORKSPACE / plugin['localDirectory']
    assert repo.is_dir(), f'missing {repo}'
    for manifest in ('plugin.json', 'kimi.plugin.json', '.codex-plugin/plugin.json', '.claude-plugin/plugin.json', '.zcode-plugin/plugin.json'):
        data = json.loads((repo / manifest).read_text())
        assert data['name'] == name and data['version'] == plugin['version'], manifest
    for kind in ('setup', 'use'):
        skill = f'{name}-{kind}'
        text = (repo / 'skills' / skill / 'SKILL.md').read_text()
        assert re.search(rf'^name: {re.escape(skill)}$', text, re.M), skill
        assert '../setup/SKILL.md' not in text, skill
    notice = (repo / 'THIRD-PARTY-NOTICES.md').read_text()
    assert 'zai-org/zcode-plugins' in notice and '0cc58d6' in notice, name
print(f'validated {len(seen)} local candidate {"catalog entries" if catalog_only else "packages"}')
