# Full Work Plugins

A marketplace line for everyday office work. Its first three local candidates wrap the DingTalk, Lark, and WeCom CLIs for messaging, documents, spreadsheets, calendars, and tasks. The catalog and independent package layout follows [Full Stack Plugins](https://github.com/partme-ai/full-stack-plugins).

| Plugin | Local package | CLI source | Workflow source |
| --- | --- | --- | --- |
| DingTalk CLI | `../full-work-plugins-repositories/dingtalk-cli-plugin` | [DingTalk Workspace CLI](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) | [ZCode dingtalk-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/dingtalk-cli) |
| Lark CLI | `../full-work-plugins-repositories/lark-cli-plugin` | [Lark CLI](https://github.com/larksuite/cli) | [ZCode lark-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/lark-cli) |
| WeCom CLI | `../full-work-plugins-repositories/wecom-cli-plugin` | [WeCom CLI](https://github.com/WecomTeam/wecom-cli) | [ZCode wecom-cli](https://github.com/zai-org/zcode-plugins/tree/0cc58d6/plugins/wecom-cli) |

All three entries in `catalog.json` have `local_candidate` status. Their local plugin packages can be installed by a host that supports local Agent Plugins, but independent remote repositories and version releases have not been published. They therefore do not appear in public Codex, ZCode, or Kimi marketplace manifests. Each package includes a source notice and setup/CLI Skills. It does not bundle the vendor binary or account credentials.

Run `python3 scripts/validate-candidates.py` to check the catalog, manifests, Skill names, and provenance declarations. CLI installation, authentication, live operations, and host loading require separate verification.
