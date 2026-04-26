# S4: Generated Workflow Doc Sync

## Purpose

Keep pgg managed docs, skill docs, and generated template output aligned with the new agent routing contract.

## Update Targets

- `AGENTS.md`
- `.codex/add/WOKR-FLOW.md`
- `.codex/add/STATE-CONTRACT.md`
- `.codex/add/EXPERT-ROUTING.md`
- `.codex/skills/pgg-add/SKILL.md`
- `.codex/skills/pgg-plan/SKILL.md`
- `.codex/skills/pgg-code/SKILL.md`
- `.codex/skills/pgg-refactor/SKILL.md`
- `.codex/skills/pgg-qa/SKILL.md`
- `.codex/skills/pgg-token/SKILL.md`
- `.codex/skills/pgg-performance/SKILL.md`
- `packages/core/src/templates.ts`
- generated `packages/core/dist/*` outputs impacted by templates

## Rules

- `EXPERT-ROUTING.md` and `agents/main.toml` must describe the same matrix.
- Skill docs should reference the matrix and list only the two primary agents for that skill.
- Avoid copying large agent instructions into every skill file.
- Existing workflow status evidence rules must remain unchanged.
- Existing git publish message and archive rules must remain unchanged.

## Acceptance

- `node packages/cli/dist/index.js update` regenerates managed docs without reintroducing old rosters.
- `rg` checks find no obsolete three-primary-agent roster language in managed docs.
- Template source and generated files are both updated.
