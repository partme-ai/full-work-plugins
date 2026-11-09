#!/usr/bin/env python3
"""验证本地办公插件候选包与目录的一致性。"""
import json
import pathlib
import re
import sys
import os
from urllib.request import Request, urlopen

ROOT = pathlib.Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent / 'full-work-plugins-repositories'
catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
catalog_only = '--catalog-only' in sys.argv[1:]
remote = '--remote' in sys.argv[1:]
assert set(sys.argv[1:]) <= {'--catalog-only', '--remote'}, 'unsupported argument'
seen = set()
published = {entry['id'] for entry in catalog['plugins']}
releases = json.loads((ROOT / 'docs/craft-marketplace-candidate-releases.json').read_text(encoding='utf-8'))
for plugin in catalog['candidatePlugins']:
    name = plugin['id']
    assert name not in seen, f'duplicate plugin {name}'
    seen.add(name)
    assert name not in published, f'{name}: candidate is published'
    assert plugin['line'] == 'full-work'
    for field in ('displayName', 'description', 'shortDescription'):
        assert plugin[field] and plugin['localizations']['zh-CN'][field], (name, field)
    if plugin['status'] == 'release_candidate_installable':
        assert plugin['repository'] == f'full-aigc-plugins/{plugin["localDirectory"]}'
        assert re.fullmatch(r'\d+\.\d+\.\d+-[\w.-]+', plugin['version'])
        release = next((item for item in releases if item['plugin'] == name and item['version'] == plugin['version']), None)
        assert release and re.fullmatch(r'[0-9a-f]{64}', release['archiveSha256']), name
        assert release['releaseUrl'] == f'https://github.com/{plugin["repository"]}/releases/tag/v{plugin["version"]}'
        if remote:
            headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'full-work-plugins-validator'}
            token = os.environ.get('GH_TOKEN') or os.environ.get('GITHUB_TOKEN')
            if token:
                headers['Authorization'] = f'Bearer {token}'
            url = f'https://api.github.com/repos/{plugin["repository"]}/releases/tags/v{plugin["version"]}'
            with urlopen(Request(url, headers=headers), timeout=30) as response:
                published = json.load(response)
            assert published['tag_name'] == f'v{plugin["version"]}' and published['prerelease'] and not published['draft'], name
            asset = next((item for item in published['assets'] if item['name'] == release['archive']), None)
            assert asset and asset['size'] == release['bytes'], f'{name}: Release ZIP missing or size differs'
        continue
    assert plugin['status'] == 'local_candidate'
    assert plugin['repository'] == f'full-work-plugins/{plugin["localDirectory"]}'
    assert plugin['componentTypes'] == ['skills']
    if catalog_only:
        continue
    repo = WORKSPACE / plugin['localDirectory']
    assert repo.is_dir(), f'missing {repo}'
    for manifest in ('plugin.json', 'kimi.plugin.json', '.codex-plugin/plugin.json', '.claude-plugin/plugin.json', '.zcode-plugin/plugin.json'):
        data = json.loads((repo / manifest).read_text(encoding='utf-8'))
        assert data['name'] == name and data['version'] == plugin['version'], manifest
    for kind in ('setup', 'use'):
        skill = f'{name}-{kind}'
        text = (repo / 'skills' / skill / 'SKILL.md').read_text(encoding='utf-8')
        assert re.search(rf'^name: {re.escape(skill)}$', text, re.M), skill
        assert '../setup/SKILL.md' not in text, skill
    notice = (repo / 'THIRD-PARTY-NOTICES.md').read_text(encoding='utf-8')
    assert 'zai-org/zcode-plugins' in notice and '0cc58d6' in notice, name
print(f'validated {len(seen)} candidate {"catalog entries" if catalog_only else "packages"}')
