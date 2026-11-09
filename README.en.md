# Full Work Plugins

A marketplace line for everyday office work, following the catalog plus independent package layout of [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins). The first three released plugins wrap the DingTalk, Lark, and WeCom CLIs for messaging, documents, spreadsheets, calendars, and tasks.

## Packages and sources

| Plugin | Local package | CLI source | Workflow source |
| --- | --- | --- | --- |
| [DingTalk CLI v0.1.0](https://github.com/full-work-plugins/dingtalk-cli-plugin/releases/tag/v0.1.0) | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| [Lark CLI v0.1.0](https://github.com/full-work-plugins/lark-cli-plugin/releases/tag/v0.1.0) | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| [WeCom CLI v0.1.0](https://github.com/full-work-plugins/wecom-cli-plugin/releases/tag/v0.1.0) | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |

## Install and use

All three independent repositories have published `v0.1.0` Releases. The global and Chinese host catalogs pin those versions. Add `partme-ai/full-work-plugins` as a Codex or ZCode marketplace, then select `dingtalk-cli`, `lark-cli`, or `wecom-cli`. In Kimi Code CLI, use `/plugins marketplace https://raw.githubusercontent.com/partme-ai/full-work-plugins/main/kimi-marketplace.json`. Each package includes a source notice and setup/use Skills; it does not bundle the vendor binary or credentials. Package CI and remote Release checks passed. Account authorization, live business calls, and host loading remain unverified.

## Marketplace layout

`catalog.json` is the single source for marketplace metadata. `candidatePlugins` tracks local candidates; only verified, released entries under `plugins` are emitted to the public host manifests. The generation and validation scripts are adapted from [Full Stack Plugins at `6d7cc12`](https://github.com/partme-ai/full-stack-plugins/tree/6d7cc1229ec9b9b62c3adeac527d5692c7361475). The generated files are `.agents/plugins/marketplace.json` (Codex), `marketplace.json` (ZCode), `kimi-marketplace.json` (Kimi), and the corresponding `cn-marketplace/` and `atomgit-marketplace/` channel outputs. `dsh/index.json` is a separate generated index. Plugin code lives in sibling repositories under `full-work-plugins-repositories/`.

The public manifests now contain three plugins. The Chinese catalogs continue to use verified GitHub Release sources; Gitee and AtomGit mirrors have not been published.

## Validation and release gate

Run `python3 scripts/validate-candidates.py --catalog-only`, `node scripts/sync-marketplaces.mjs --remote`, `node scripts/sync-cn-marketplace.mjs`, `node scripts/sync-cn-marketplace.mjs --channel=atomgit`, and `node scripts/verify-channel-parity.mjs` to check generated outputs and remote Releases. CI checks out pinned plugin tags before validation.

Before moving a candidate into `plugins`, verify its independent version tag and Release, add its logo and repository marketplace manifest, generate the public host manifests, and validate the remote version. A feature branch is not a published installation source.
