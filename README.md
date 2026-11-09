# Full Work Plugins

面向非技术岗位的办公插件线，沿用 [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins) 的“市场仓 + 独立插件仓”结构。首批提供钉钉、飞书、企业微信和腾讯会议的本机 CLI 工作流，覆盖消息、文档、表格、日历与待办。

办公市场还收录 13 个 Craft 创作插件，当前均为预发布候选。独立仓库与 Release 仍由 [full-aigc-plugins](https://github.com/full-aigc-plugins) 维护；本市场只管理安装入口，不复制体积较大的插件包。

## 插件目录与来源

| 插件 | 本地插件目录 | 上游 CLI | 来源 |
| --- | --- | --- | --- |
| [钉钉 CLI v0.1.1](https://github.com/full-work-plugins/dingtalk-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| [飞书 CLI v0.1.1](https://github.com/full-work-plugins/lark-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| [企业微信 CLI v0.1.1](https://github.com/full-work-plugins/wecom-cli-plugin/releases/tag/v0.1.1) | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |
| [腾讯会议 CLI v0.1.0](https://github.com/full-work-plugins/tencent-meeting-cli-plugin/releases/tag/v0.1.0) | `../full-work-plugins-repositories/tencent-meeting-cli-plugin` | [Tencent Meeting CLI](https://github.com/TencentCloud/tencentmeeting-cli) | [ZCode tencent-meeting-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/tencent-meeting-cli) |

CADCraft、DeckCraft、DesignCraft、EffectCraft、FigCraft、FilmCraft、GridCraft、LightCraft、PdfCraft、PhotoCraft、SoundCraft、VectorCraft、WordCraft 的准确仓库、版本、中文展示名和图标路径记录于 [`catalog.json`](catalog.json)；ZIP 资产、SHA-256 与 Release 来源记录于 [`docs/craft-marketplace-candidate-releases.json`](docs/craft-marketplace-candidate-releases.json)。Codex 从固定 Git 标签安装；ZCode 从校验过摘要的 Release ZIP 安装，单个 ZIP 条目超过宿主限制时回退到固定 Git 标签。安装时才下载运行包。

聚合目录与本地市场的构建方式参考 [ZCode 官方插件仓的市场结构](https://github.com/zai-org/zcode-plugins)：市场清单使用相对 `./plugins/<id>` 来源，完整插件目录随本地分发目录复制。独立插件代码和历史来源见各包仓库；本仓只生成固定版本副本。

## 安装与使用

四个独立插件仓分别发布固定版本，全球及中文市场清单均引用固定版本。Codex 可将 `partme-ai/full-work-plugins` 添加为插件市场，再选择 `dingtalk-cli`、`lark-cli`、`wecom-cli`、`tencent-meeting-cli`。ZCode 在设置中的插件市场添加 `partme-ai/full-work-plugins`；Kimi Code CLI 使用 `/plugins marketplace https://raw.githubusercontent.com/partme-ai/full-work-plugins/main/kimi-marketplace.json`。

插件包不附带 CLI 二进制或凭证。各插件先运行 setup Skill 检查 CLI 与身份；安装 CLI、登录和远端写操作按 Skill 提示完成。发布前已通过跨平台包结构检查与市场远端 Release 校验；账号授权、宿主实际加载和真实业务请求尚未验收。

## 市场结构

`catalog.json` 是唯一目录事实源。`plugins` 保存四个正式发布的办公 CLI；十三个 Craft 条目保留 `release_candidate_installable` 状态，供受控测试。市场生成与校验脚本改编自 [Full Stack Plugins 的 feature 分支 `6d7cc12`](https://github.com/partme-ai/full-stack-plugins/tree/6d7cc1229ec9b9b62c3adeac527d5692c7361475)，已将仓库路径、渠道名称和插件线改为 `full-work`。

```text
full-work-plugins/
├── catalog.json                        # 已发布与候选元数据
├── .agents/plugins/marketplace.json    # Codex 全球清单（生成）
├── marketplace.json                    # ZCode 全球清单（生成）
├── kimi-marketplace.json               # Kimi 全球清单（生成）
├── channels/                            # 全球与中文渠道设置
├── cn-marketplace/                     # 中文清单（生成，GitHub 安装源）
├── atomgit-marketplace/                # 中文清单（生成，GitHub 安装源）
├── dsh/index.json                      # DSH 索引（生成）
├── plugins/                            # 四个办公 CLI 完整包
├── dist/local-marketplace/             # 本地分发目录（生成，不提交）
└── scripts/                             # 生成、校验与后续发版工具
```

插件实现的事实源在相邻的 `full-work-plugins-repositories/<插件名>-plugin/` 中。`plugins/` 保存从固定 Release 生成的完整本地包；Codex 读取包内的图标和中文展示字段，ZCode、Kimi 仍引用独立仓库。不要直接修改生成包。各插件仓维护 `.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`.zcode-plugin/plugin.json`、`kimi.plugin.json`、`plugin.json` 和 `skills/`。中文清单目前仍使用已验证的 GitHub Release 安装源；Gitee 与 AtomGit 镜像尚未发布，不在清单中伪造镜像地址。

## 校验与后续发版

```bash
python3 scripts/validate-candidates.py --catalog-only
node scripts/sync-codex-bundles.mjs
node scripts/sync-marketplaces.mjs --remote
node scripts/sync-cn-marketplace.mjs
node scripts/sync-cn-marketplace.mjs --channel=atomgit
node scripts/verify-channel-parity.mjs
node scripts/build-local-marketplace.mjs
```

上述命令默认只检查；改动 catalog 后使用对应脚本的 `--write` 生成，再重新运行检查。CI 从版本标签检出四个独立插件仓，核验 manifest、logo 和 GitHub Release。后续版本须先在插件仓完成版本标签与 Release，再更新本市场的 `catalog.json` 和生成清单。
