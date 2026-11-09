# Full Work Plugins

面向非技术岗位的办公插件线，沿用 [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins) 的“市场仓 + 独立插件仓”结构。首批提供钉钉、飞书和企业微信的本机 CLI 工作流，覆盖消息、文档、表格、日历与待办。

## 插件目录与来源

| 插件 | 本地插件目录 | 上游 CLI | 来源 |
| --- | --- | --- | --- |
| 钉钉 CLI | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| 飞书 CLI | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| 企业微信 CLI | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |

## 当前状态与本地使用

`catalog.json` 中的三项属于 `local_candidate`：本地插件包可安装并触发各自的 setup/use Skill；独立远端仓库已有 feature 分支，但尚未发布版本 Release。因此它们尚未进入面向公网的 Codex、ZCode、Kimi 市场清单，不能把 feature 分支当成已发布版本。

在支持本地插件安装的宿主中，选择对应的 `full-work-plugins-repositories/<name>-plugin` 目录；先运行 `<name>-setup` 检查本机 CLI 与账号，再用 `<name>-use` 处理任务。插件不附带 CLI 二进制或凭证；安装 CLI、登录和远端写操作按 Skill 提示完成。没有账号时可以验证结构与帮助，不能声称业务调用可用。

运行 `python3 scripts/validate-candidates.py` 检查市场目录、宿主 manifest、Skill 命名与来源声明。CLI 安装、账号授权、宿主加载和真实业务请求需要分别验证。

## 市场结构

`catalog.json` 是唯一目录事实源。`candidatePlugins` 保存尚未发布的本地包；只有经过独立仓库版本 Release 验证的 `plugins` 条目才会进入公开市场清单。市场生成与校验脚本改编自 [Full Stack Plugins 的 feature 分支 `6d7cc12`](https://github.com/partme-ai/full-stack-plugins/tree/6d7cc1229ec9b9b62c3adeac527d5692c7361475)，已将仓库路径、渠道名称和插件线改为 `full-work`。

```text
full-work-plugins/
├── catalog.json                        # 已发布与候选元数据
├── .agents/plugins/marketplace.json    # Codex 全球清单（生成）
├── marketplace.json                    # ZCode 全球清单（生成）
├── kimi-marketplace.json               # Kimi 全球清单（生成）
├── channels/                            # 全球、Gitee、AtomGit 渠道设置
├── cn-marketplace/                     # 中文 Gitee 清单（生成）
├── atomgit-marketplace/                # 中文 AtomGit 清单（生成）
├── dsh/index.json                      # DSH 索引（生成）
└── scripts/                             # 生成、校验与后续发版工具
```

插件实现只放在相邻的 `full-work-plugins-repositories/<插件名>-plugin/` 中。各插件仓维护 `.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`.zcode-plugin/plugin.json`、`kimi.plugin.json`、`plugin.json` 和 `skills/`。当前三个插件均无版本 Release，因此上述公开清单为空；Gitee 与 AtomGit 的镜像配置也只是生成准备，不表示镜像已上线。

## 校验与后续发版

```bash
python3 scripts/validate-candidates.py
node scripts/sync-marketplaces.mjs
node scripts/sync-cn-marketplace.mjs
node scripts/sync-cn-marketplace.mjs --channel=atomgit
node scripts/verify-channel-parity.mjs
```

上述命令默认只检查；改动 catalog 后使用对应脚本的 `--write` 生成，再重新运行检查。CI 对候选目录执行 `--catalog-only`，本地完整模式还会检查相邻插件仓。发版时先验证插件仓的版本标签和 Release，再将对应条目从 `candidatePlugins` 移入 `plugins`，补齐 logo 和独立仓清单，生成三宿主市场清单并校验远端版本。不要把 feature 分支写作正式安装源。
