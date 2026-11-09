# Full Work Plugins

本仓库是办公插件市场目录；插件实现位于相邻的 `full-work-plugins-repositories/<name>-plugin/`，不要把 Skill 实现放进本目录。

`catalog.json` 是插件 ID、版本、状态与本地目录的事实源。`local_candidate` 只表示本地包可验证，不表示独立 GitHub 仓库、版本标签或 Release 已发布。未核验远端发布时，不把候选条目写进公网市场清单。

首批插件改写自 ZCode 官方市场的同名 CLI 插件。每个插件的 `THIRD-PARTY-NOTICES.md` 必须标明来源提交、原封装作者、厂商 CLI 来源与改动范围。不得打包凭证或厂商二进制。远端写操作由 Skill 明确确认目标与变更。

运行 `python3 scripts/validate-candidates.py` 做目录与插件包静态验证。真实 CLI、认证、业务 API 和宿主安装分别验收，不互相替代。
