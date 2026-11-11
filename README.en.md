# Full Work Plugins

A marketplace line for everyday office work, following the catalog plus independent package layout of [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins). The four released plugins wrap the DingTalk, Lark, WeCom, and Tencent Meeting CLIs for messaging, documents, spreadsheets, calendars, and tasks.

## Packages and sources

| Plugin | Local package | CLI source | Workflow source |
| --- | --- | --- | --- |
| [DingTalk CLI v0.1.1](https://github.com/full-work-plugins/dingtalk-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| [Lark CLI v0.1.1](https://github.com/full-work-plugins/lark-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| [WeCom CLI v0.1.1](https://github.com/full-work-plugins/wecom-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |
| [Tencent Meeting CLI v0.1.0](https://github.com/full-work-plugins/tencent-meeting-cli-plugin/releases/tag/v0.1.0) | `../full-work-plugins-repositories/tencent-meeting-cli-plugin` | [Tencent Meeting CLI](https://github.com/TencentCloud/tencentmeeting-cli) | [ZCode tencent-meeting-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/tencent-meeting-cli) |

## Install and use

The four independent repositories publish pinned Releases. The global and Chinese host catalogs pin those versions. Add `partme-ai/full-work-plugins` as a Codex or ZCode marketplace, then select `dingtalk-cli`, `lark-cli`, `wecom-cli`, or `tencent-meeting-cli`. In Kimi Code CLI, use `/plugins marketplace https://raw.githubusercontent.com/partme-ai/full-work-plugins/main/kimi-marketplace.json`. Each package includes a source notice and setup/use Skills; it does not bundle the vendor binary or credentials. Package CI and remote Release checks passed. Account authorization, live business calls, and host loading remain unverified.

## Marketplace layout

`catalog.json` is the single source for marketplace metadata. `candidatePlugins` tracks local candidates; only verified, released entries under `plugins` are emitted to the public host manifests. The generation and validation scripts are adapted from [Full Stack Plugins at `6d7cc12`](https://github.com/partme-ai/full-stack-plugins/tree/6d7cc1229ec9b9b62c3adeac527d5692c7361475). The generated files are `.agents/plugins/marketplace.json` (Codex), `marketplace.json` (ZCode), `kimi-marketplace.json` (Kimi), and the corresponding `cn-marketplace/` and `atomgit-marketplace/` channel outputs. `dsh/index.json` is a separate generated index. Plugin code lives in sibling repositories under `full-work-plugins-repositories/`.

The public manifests now contain four plugins. Codex uses generated local package snapshots under `plugins/` so uninstalled cards can resolve branded images; the independently released package repositories remain the source of truth. The Chinese catalogs continue to use verified GitHub Release sources; Gitee and AtomGit mirrors have not been published.

## Validation and release gate

Run `python3 scripts/validate-candidates.py --catalog-only`, `node scripts/sync-marketplaces.mjs --remote`, `node scripts/sync-cn-marketplace.mjs`, `node scripts/sync-cn-marketplace.mjs --channel=atomgit`, and `node scripts/verify-channel-parity.mjs` to check generated outputs and remote Releases. CI checks out pinned plugin tags before validation.

Before moving a candidate into `plugins`, verify its independent version tag and Release, add its logo and repository marketplace manifest, generate the public host manifests, and validate the remote version. A feature branch is not a published installation source.

## DeepSeek Harness plugin index

Enable the experimental Custom plugin indexes bundle in DSH Plugins, then add this HTTPS index source in Discover:

```text
https://raw.githubusercontent.com/partme-ai/full-work-plugins/main/dsh/index.json
```

DSH has no built-in third-party index sources. This index pins immutable release commits from independent plugin repositories and installs each bundle from the repository root so skills and scripts are included. A local CLI and its authorization remain separate setup steps. Unpublished `local_candidate` entries stay out of the index. See the [official DSH plugin market guide](https://deepseek-harness.github.io/deepseek-harness/guide/plugin-market).
