---
pgg:
  topic: "pgg-codex-subagent-schema-and-lang-sync"
  stage: "review"
  status: "reviewed"
  score: 96
  updated_at: "2026-04-27T01:39:54Z"
---

# proposal.review

## Expert Notes

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| Product manager | 96 | The issue is correctly framed as a patch-level product defect: generated Codex agent files are ignored because they do not match the official schema, and generated language drift weakens init/update trust. | none |
| UX/UI expert | 95 | Language-inconsistent generated docs create confusing workflow surfaces, especially when users switch `pgg lang`; the proposal keeps the fix focused on generated assets users actually read. | none |
| Docs researcher | 97 | OpenAI Codex subagents documentation confirms custom agent files require `name`, `description`, and `developer_instructions`; pgg-only `category` and `activation` fields should not be emitted as standalone agent TOML fields. | none |

## Evidence Checked

- Official OpenAI Codex Subagents documentation: `https://developers.openai.com/codex/subagents`
- Current malformed generated role example: `.codex/agents/product-manager.toml`
- Current malformed routing manifest example: `.codex/agents/main.toml`
- Template source for agent files: `packages/core/src/templates.ts`
- Project language and managed file manifest: `.pgg/project.json`
- Language/update sync path: `packages/core/src/index.ts`, `packages/cli/src/index.ts`

## Decision

Approved for `pgg-plan` with `archive_type=fix`, `version_bump=patch`, and `target_version=2.3.3`.
