# 腾讯会议 CLI 插件

使用本机 `tmeet` CLI 管理会议、录制和参会报告。插件提供 `tencent-meeting-cli-setup` 和 `tencent-meeting-cli-use` 两个 Skill。

安装插件包不会自动安装 CLI。setup Skill 检查本机命令与 OAuth2 状态；缺少 CLI 时，按上游安装说明经用户授权后安装。业务命令先查本机实时帮助。插件不附带 CLI 二进制或凭证。

来源：[ZCode `tencent-meeting-cli`](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/tencent-meeting-cli)；实际命令由 [TencentCloud/tencentmeeting-cli](https://github.com/TencentCloud/tencentmeeting-cli) 提供。许可与图标来源见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
