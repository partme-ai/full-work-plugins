# Full Work Plugins

本仓库是办公插件市场目录；插件实现位于相邻的 `full-work-plugins-repositories/<name>-plugin/`，不要把 Skill 实现放进本目录。

`catalog.json` 是插件 ID、版本、状态与本地目录的事实源。`local_candidate` 只表示本地包可验证，不表示独立 GitHub 仓库、版本标签或 Release 已发布。未核验远端发布时，不把候选条目写进公网市场清单。

首批插件改写自 ZCode 官方市场的同名 CLI 插件。每个插件的 `THIRD-PARTY-NOTICES.md` 必须标明来源提交、原封装作者、厂商 CLI 来源与改动范围。不得打包凭证或厂商二进制。远端写操作由 Skill 明确确认目标与变更。

运行 `python3 scripts/validate-candidates.py` 做目录与插件包静态验证。`scripts/sync-marketplaces.mjs`、`scripts/sync-cn-marketplace.mjs` 生成三宿主与渠道清单；生成物只由脚本写入。CI 用 `--catalog-only` 验证候选目录，本地完整模式还需相邻插件仓。真实 CLI、认证、业务 API 和宿主安装分别验收，不互相替代。

当前尚无已发布办公插件，公开清单为空是预期结果。`channels/` 中的 Gitee 与 AtomGit 配置只描述未来镜像输出，不证明镜像已部署。发布前须核对独立仓库的版本标签、Release、logo 与宿主清单，不得将 feature 分支伪装成发布版本。
