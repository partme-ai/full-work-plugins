# Full Work Plugins

面向非技术岗位的办公插件线。首批提供钉钉、飞书和企业微信的本机 CLI 工作流，覆盖消息、文档、表格、日历与待办。各插件是独立目录，市场目录只维护元数据，沿用 [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins) 的“市场 + 独立插件仓”结构。

| 插件 | 本地插件目录 | 上游 CLI | 来源 |
| --- | --- | --- | --- |
| 钉钉 CLI | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| 飞书 CLI | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| 企业微信 CLI | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |

## 当前状态与本地使用

`catalog.json` 中的三项属于 `local_candidate`：本地插件包可安装并触发各自的 setup/use Skill；独立远端仓库已有 feature 分支，但尚未发布版本 Release。因此它们尚未进入面向公网的 Codex、ZCode、Kimi 市场清单，不能把 feature 分支当成已发布版本。

在支持本地插件安装的宿主中，选择对应的 `full-work-plugins-repositories/<name>-plugin` 目录；先运行 `<name>-setup` 检查本机 CLI 与账号，再用 `<name>-use` 处理任务。插件不附带 CLI 二进制或凭证；安装 CLI、登录和远端写操作按 Skill 提示完成。没有账号时可以验证结构与帮助，不能声称业务调用可用。

运行 `python3 scripts/validate-candidates.py` 检查市场目录、四宿主 manifest、Skill 命名与来源声明。发布时需在独立插件仓创建真实版本和 Release，经远端验证后再将 `local_candidate` 移入正式 `plugins`，生成宿主市场清单。
