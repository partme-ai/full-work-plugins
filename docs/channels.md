# 市场渠道

`catalog.json` 保存插件身份与版本，`channels/` 保存展示语言和代码托管域名。生成脚本只读取 `plugins` 中已发布的条目；`candidatePlugins` 不会进入公开清单。

| 渠道 | 配置 | 输出 | 当前状态 |
| --- | --- | --- | --- |
| GitHub 全球 | `channels/global.json` | 根目录三宿主清单 | 3 个正式插件，GitHub Release |
| 中文渠道 | `channels/cn.json` | `cn-marketplace/` | 3 个正式插件，GitHub Release |
| 中文渠道备用输出 | `channels/atomgit.json` | `atomgit-marketplace/` | 3 个正式插件，GitHub Release |

检查命令：

```bash
node scripts/sync-marketplaces.mjs
node scripts/sync-cn-marketplace.mjs
node scripts/sync-cn-marketplace.mjs --channel=atomgit
node scripts/verify-channel-parity.mjs
```

更新目录或渠道配置后，先使用对应生成命令的 `--write` 写入产物，再运行以上检查。当前两个中文输出均引用已发布的 GitHub 标签和资源文件；Gitee 与 AtomGit 镜像尚未发布，不应把目录名解释为镜像源。切换到镜像地址前须验证目标平台的仓库、标签、Release 和图标均可访问。
