# Full Work Plugins

A marketplace line for everyday office work, following the catalog plus independent package layout of [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins). The first three local candidates wrap the DingTalk, Lark, and WeCom CLIs for messaging, documents, spreadsheets, calendars, and tasks.

## Packages and sources

| Plugin | Local package | CLI source | Workflow source |
| --- | --- | --- | --- |
| DingTalk CLI | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| Lark CLI | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| WeCom CLI | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |

## Current status and local use

All three entries in `catalog.json` have `local_candidate` status. Their local plugin packages can be installed by a host that supports local Agent Plugins, and each independent repository has a feature branch. No version Release has been published, so they do not appear in public Codex, ZCode, or Kimi marketplace manifests. Each package includes a source notice and setup/use Skills. It does not bundle the vendor binary or account credentials. CLI installation, authentication, live operations, and host loading require separate verification.

## Marketplace layout

`catalog.json` is the single source for marketplace metadata. `candidatePlugins` tracks local candidates; only verified, released entries under `plugins` are emitted to the public host manifests. The generation and validation scripts are adapted from [Full Stack Plugins at `6d7cc12`](https://github.com/partme-ai/full-stack-plugins/tree/6d7cc1229ec9b9b62c3adeac527d5692c7361475). The generated files are `.agents/plugins/marketplace.json` (Codex), `marketplace.json` (ZCode), `kimi-marketplace.json` (Kimi), and the corresponding `cn-marketplace/` and `atomgit-marketplace/` channel outputs. `dsh/index.json` is a separate generated index. Plugin code lives in sibling repositories under `full-work-plugins-repositories/`.

The public manifests currently contain zero plugins. The Gitee and AtomGit channel settings prepare generated outputs and do not claim that a remote mirror is live.

## Validation and release gate

Run `python3 scripts/validate-candidates.py` locally to check the catalog, manifests, Skill names, and provenance. Run `node scripts/sync-marketplaces.mjs`, `node scripts/sync-cn-marketplace.mjs`, `node scripts/sync-cn-marketplace.mjs --channel=atomgit`, and `node scripts/verify-channel-parity.mjs` to check generated outputs. The CI uses `--catalog-only` for candidate validation because sibling repositories are not checked out there.

Before moving a candidate into `plugins`, verify its independent version tag and Release, add its logo and repository marketplace manifest, generate the public host manifests, and validate the remote version. A feature branch is not a published installation source.
