# 来源与许可

- setup/CLI Skill 基于 [ZCode `tencent-meeting-cli`](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/tencent-meeting-cli) 提取并改写，来源提交 `0cc58d6`。原封装作者 Z.ai，仓库许可 Apache-2.0；本插件由 PartMe.AI 维护。
- 实际 CLI 来源：[TencentCloud/tencentmeeting-cli](https://github.com/TencentCloud/tencentmeeting-cli)，npm 包 `@tencentcloud/tmeet`。本仓库不附带 CLI 二进制或凭证。
- 图标来源：[ZCode `tencent-meeting-cli` 图标](https://github.com/zai-org/zcode-plugins/blob/0cc58d6/assets/tencent-meeting-cli/icon.png)；ZCode 记录的原始来源为 https://cdn-zcode.z.ai/zcode/official-plugin/assets/tencent-meeting-cli/icon.png。图标属于对应品牌，按识别用途展示。
- 改写内容：独立插件目录、跨宿主 manifest、唯一 Skill 名称，以及去除依赖相邻 Skill 目录的相对引用。
