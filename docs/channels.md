# 市场渠道

`catalog.json` 保存插件身份与版本，`channels/` 保存展示语言和代码托管域名。生成脚本只读取 `plugins` 中已发布的条目；`candidatePlugins` 不会进入公开清单。

| 渠道 | 配置 | 输出 | 当前状态 |
| --- | --- | --- | --- |
| GitHub 全球 | `channels/global.json` | 根目录三宿主清单 | 已生成，0 个正式插件 |
| Gitee 中文 | `channels/cn.json` | `cn-marketplace/` | 已生成，镜像未验收 |
| AtomGit 中文 | `channels/atomgit.json` | `atomgit-marketplace/` | 已生成，镜像未验收 |

检查命令：

```bash
node scripts/sync-marketplaces.mjs
node scripts/sync-cn-marketplace.mjs
node scripts/sync-cn-marketplace.mjs --channel=atomgit
node scripts/verify-channel-parity.mjs
```

更新目录或渠道配置后，先使用对应生成命令的 `--write` 写入产物，再运行以上检查。正式发布前还需验证独立插件仓的版本标签、Release、资源文件及目标镜像地址；生成清单本身不证明镜像可用。
