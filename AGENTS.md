# Full Work Plugins

本仓库是办公插件市场目录；插件实现的事实源位于相邻的 `full-work-plugins-repositories/<name>-plugin/`。`plugins/` 是从已发布版本生成的 Codex 本地分发包，用于让未安装的卡片读取品牌图标；不要直接在此目录编辑 Skill。

`catalog.json` 是插件 ID、版本、状态与本地目录的事实源。`local_candidate` 只表示本地包可验证，不表示独立 GitHub 仓库、版本标签或 Release 已发布。未核验远端发布时，不把候选条目写进公网市场清单。

首批插件改写自 ZCode 官方市场的同名 CLI 插件。每个插件的 `THIRD-PARTY-NOTICES.md` 必须标明来源提交、原封装作者、厂商 CLI 来源与改动范围。不得打包凭证或厂商二进制。远端写操作由 Skill 明确确认目标与变更。

运行 `python3 scripts/validate-candidates.py` 做目录与插件包静态验证。`scripts/sync-codex-bundles.mjs --write` 从已发布插件仓生成 Codex 本地分发包；`scripts/sync-marketplaces.mjs`、`scripts/sync-cn-marketplace.mjs` 生成三宿主与渠道清单；生成物只由脚本写入。CI 用 `--catalog-only` 验证候选目录，本地完整模式还需相邻插件仓。真实 CLI、认证、业务 API 和宿主安装分别验收，不互相替代。

当前钉钉、飞书、企业微信插件已发布 `v0.1.1`，腾讯会议插件已发布 `v0.1.0`，正式清单引用固定版本。CI 从版本标签检出独立插件仓并核对 GitHub Release。中文渠道清单目前使用 GitHub 安装源；Gitee、AtomGit 镜像仍未发布，不得伪造镜像地址。后续发版须核对独立仓库的版本标签、Release、logo 与宿主清单，不得将 feature 分支伪装成发布版本。
