---
pgg:
  topic: "pgg-codex-agents-path-sync"
  stage: "token"
  status: "reviewed"
  skill: "pgg-token"
  score: 94
  updated_at: "2026-04-27T00:34:28Z"
  archive_type: "fix"
  project_scope: "current-project"
---

# Token Audit Report

## Decision

pass

## Applicability

- `pgg-token`: `required` | workflow assets, generated agent files, and state-pack handoff routing references changed.
- `pgg-performance`: `not_required` | no runtime performance-sensitive behavior changed.

## Measurements

| Surface | Lines | Words | Bytes | Token Cost Role |
|---|---:|---:|---:|---|
| `pgg-state-pack.sh pgg-codex-agents-path-sync` output | 51 | 258 | 2,989 | Preferred handoff payload |
| `state/current.md`, proposal, plan, task, code/refactor reviews | 472 | 2,457 | 22,022 | Full topic context without specs |
| four spec files | 163 | 579 | 4,900 | Planning detail refs |
| implementation diffs | 1,871 | 10,260 | 294,301 | Largest evidence surface; use by diff ref only |
| `.codex/agents/*.toml` | 532 | 2,746 | 19,958 | Generated asset surface; do not paste into handoff |
| `AGENTS.md`, `.codex/add/*`, `pgg-state-pack.sh` | 363 | 2,142 | 21,292 | Workflow instruction/helper surface |
| `packages/core/src/templates.ts`, `skill-generation.test.mjs` | 3,916 | 18,457 | 196,018 | Source/test surface; inspect targeted sections only |

## Reduction Results

- Preferred state-pack handoff is 258 words.
- Full topic docs plus specs are 3,036 words, so state-pack avoids about 91.5% of that initial handoff surface.
- Full topic docs, specs, and implementation diffs are 13,296 words, so state-pack avoids about 98.1% of the full evidence surface.
- The generated `.codex/agents/*.toml` set is 2,746 words; handoff should reference `.codex/agents/main.toml` instead of copying role files.

## Cost Drivers

- `implementation/diffs/004_MOVE_managed_agent_files.diff` is the largest semantic diff because it records all generated agent TOML creation and old root `agents/*` deletion.
- `implementation/diffs/001_UPDATE_template_agent_paths.diff` and `005_UPDATE_agent_path_constants_refactor.diff` have high byte counts because built dist/source-map changes are included.
- `.codex/agents/*.toml` is intentionally verbose role contract material, but it should be consumed by path reference, not copied into inter-stage context.
- `packages/core/src/templates.ts` remains the largest source file. Targeted searches around agent path constants are preferable to full-file handoff.

## Optimization Actions

| Action | Basis | Result |
|---|---|---|
| Keep `state/current.md` plus `pgg-state-pack.sh` as the default handoff | 258-word state-pack vs 3,036-word docs/spec bundle | About 91.5% smaller initial handoff |
| Reference implementation diffs by path | Diffs total 10,260 words and 294,301 bytes | Avoids copying the largest evidence surface into agent prompts |
| Reference `.codex/agents/main.toml` rather than all role TOML files | Agent TOML total is 2,746 words | Keeps generated role assets opt-in |
| Keep path contract centralized in constants/helpers | Refactor removed repeated `.codex/agents` literals in template/test code | Future path changes should touch fewer code locations and reduce review/search surface |

## Expert Review

| Expert | Score | Summary | Blocking |
|---|---:|---|---|
| 테크 리드 | 94 | The workflow now exposes the correct `.codex/agents/main.toml` routing ref through a 258-word state-pack. Full docs, specs, generated agent assets, and diffs should stay path-referenced. | 없음 |
| 코드 리뷰어 | 94 | Token risk is concentrated in implementation diffs and generated TOML files. The current handoff contract avoids copying those surfaces by default and the refactor reduced path-string drift. | 없음 |

## Follow-Up

- No additional implementation change is required for token cost.
- QA should verify the required token audit exists and keep `manual verification required` for current-project verification unless a declared verification command contract is added.
