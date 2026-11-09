# Full Work Plugins

本仓库是办公插件市场目录；四个 CLI 插件实现的事实源位于相邻的 `full-work-plugins-repositories/<name>-plugin/`。`plugins/` 中四个 CLI 是固定版本的完整本地分发包；十三个 Craft 是只含图标、技能和远程运行包启动器的 Codex 入口。`dist/local-marketplace/` 由聚合脚本构建。不要直接在生成包中编辑 Skill。

`catalog.json` 是插件 ID、版本、状态与本地目录的事实源。十三个 Craft 条目为 `release_candidate_installable`，独立仓库和预发布 Release 仍属 `full-aigc-plugins`；Codex 安装轻量入口，首次启动 MCP 时按 SHA-256 校验并下载完整 Release ZIP。ZCode 仍直接从远程 Release ZIP 或固定标签安装。`local_candidate` 仍表示尚未核验的本地包，不进入公网市场。

首批插件改写自 ZCode 官方市场的同名 CLI 插件。每个插件的 `THIRD-PARTY-NOTICES.md` 必须标明来源提交、原封装作者、厂商 CLI 来源与改动范围。不得打包凭证或厂商二进制。远端写操作由 Skill 明确确认目标与变更。

运行 `python3 scripts/validate-candidates.py` 做候选验证。`scripts/sync-codex-bundles.mjs --write` 从已发布插件仓生成本地分发包；`scripts/sync-craft-codex-shells.py` 从固定 Release 生成 Craft Codex 入口；`scripts/sync-marketplaces.mjs`、`scripts/sync-cn-marketplace.mjs` 生成三宿主与渠道清单；`scripts/build-local-marketplace.mjs` 复制 Codex 本地包并保留 ZCode Craft 远程入口。生成物只由脚本写入。CI 用 `--catalog-only` 验证候选目录，本地完整模式还需相邻办公插件仓。真实 CLI、认证、业务 API 和宿主安装分别验收。

当前钉钉、飞书、企业微信插件已发布 `v0.1.1`，腾讯会议插件已发布 `v0.1.0`，正式清单引用固定版本。CI 从版本标签检出独立插件仓并核对 GitHub Release。中文渠道清单目前使用 GitHub 安装源；Gitee、AtomGit 镜像仍未发布，不得伪造镜像地址。后续发版须核对独立仓库的版本标签、Release、logo 与宿主清单，不得将 feature 分支伪装成发布版本。
