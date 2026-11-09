#!/usr/bin/env python3
"""从固定 Release 生成小体积 Codex 图标、技能和远程运行包入口。"""
import json
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts/ci'))
from craft_windows import download, safe_name

catalog = json.loads((ROOT / 'catalog.json').read_text())
releases = json.loads((ROOT / 'docs/craft-marketplace-candidate-releases.json').read_text())
by_release = {(row['plugin'], row['version']): row for row in releases}
bootstrap = (ROOT / 'scripts/craft-remote-runtime.mjs').read_bytes()

for plugin in catalog['candidatePlugins']:
    if plugin['status'] != 'release_candidate_installable':
        continue
    name, version = plugin['id'], plugin['version']
    row = by_release[name, version]
    url = row['releaseUrl'].replace('/tag/', '/download/') + '/' + row['archive']
    root_name = row.get('archiveRoot') or name + '-plugin'
    target = ROOT / 'plugins' / name
    with tempfile.TemporaryDirectory(prefix='craft-shell-') as temporary:
        temporary = Path(temporary)
        archive = temporary / row['archive']
        download(url, archive, row['archiveSha256'])
        stage = temporary / name
        stage.mkdir()
        logo_found = False
        with zipfile.ZipFile(archive) as zipped:
            for member in zipped.infolist():
                path = safe_name(member.filename)
                if path.parts[0] != root_name:
                    raise ValueError(f'{name}: unexpected archive root {path}')
                relative = Path(*path.parts[1:])
                if not relative.parts or member.is_dir():
                    continue
                if relative == Path(plugin['logo']):
                    destination = stage / relative
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    with zipped.open(member) as source, destination.open('wb') as output:
                        shutil.copyfileobj(source, output)
                    logo_found |= relative == Path(plugin['logo'])
        if not logo_found:
            raise ValueError(f'{name}: logo absent from release')
        setup = stage / 'skills' / (name + '-setup') / 'SKILL.md'
        setup.parent.mkdir(parents=True)
        setup.write_text(
            f'---\nname: {name}-setup\ndescription: 首次使用 {plugin["displayName"]} 时启动编辑器并取得完整技能。\n---\n\n'
            f'先调用 `{name}-editor` 的 `editor_status`。启动器会下载并校验固定版本的完整 Release，'
            '将原仓库技能装入本插件。然后在新会话中使用对应技能；如宿主支持，刷新技能列表即可立即使用。\n'
        )
        interface = {
            'displayName': plugin['localizations']['zh-CN']['displayName'],
            'shortDescription': plugin['localizations']['zh-CN']['shortDescription'],
            'category': plugin.get('codexCategory', plugin['category']),
            'logo': './' + plugin['logo'],
            'logoDark': './' + plugin['logo'],
            'composerIcon': './' + plugin['logo'],
            'composerIconDark': './' + plugin['logo'],
        }
        identity = {
            'name': name,
            'version': version,
            'description': plugin['localizations']['zh-CN']['description'],
            'author': {'name': 'Full AIGC Plugins', 'url': 'https://github.com/full-aigc-plugins'},
            'homepage': 'https://github.com/' + plugin['repository'],
            'repository': 'https://github.com/' + plugin['repository'],
            'skills': './skills/',
            'mcpServers': './mcp.json',
            'extensions': {'com.openai': {'interface': interface}},
        }
        overlay = {key: identity[key] for key in ('name', 'version', 'description')}
        overlay['skills'] = './skills/'
        overlay['mcpServers'] = './.codex-plugin/mcp.json'
        overlay['interface'] = interface
        mcp = {'mcpServers': {name + '-editor': {
            'type': 'stdio', 'command': 'node', 'args': ['scripts/remote-runtime.mjs'], 'cwd': '.',
            'required': True, 'startup_timeout_sec': 180
        }}}
        release_info = {
            'name': name, 'version': version, 'archiveRoot': root_name,
            'url': url, 'sha256': row['archiveSha256'],
            'sourceRepository': plugin['repository'], 'sourceCommit': row['commit'],
        }
        for filename, value in [('plugin.json', identity), ('.codex-plugin/plugin.json', overlay),
                                ('mcp.json', mcp), ('.codex-plugin/mcp.json', mcp),
                                ('runtime.json', release_info)]:
            destination = stage / filename
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
        (stage / 'scripts').mkdir()
        (stage / 'scripts/remote-runtime.mjs').write_bytes(bootstrap)
        if target.exists():
            shutil.rmtree(target)
        shutil.move(str(stage), target)
    print(f'{name}: Codex shell from {url}')
