# Code Review

## Topic

codex-multi-agent-orchestration

## Stage

implementation

## Verdict

pass

## Findings

- none

## Review Notes

- Config sync is generated from the existing project manifest path, so teams mode remains the single project-local source for `multi_agent`.
- The routing matrix is centralized in `packages/core/src/templates.ts` and rendered into `agents/main.toml`, `.codex/add/EXPERT-ROUTING.md`, `.codex/add/WOKR-FLOW.md`, and each generated skill.
- Token fanout is bounded by `max_threads=4`, `max_depth=1`, exact two primary agents per flow, support-only fallback roles, and state-pack-first handoff guidance.
- Local Codex CLI compatibility was checked against installed behavior: `multi_agent` is a stable feature flag, config uses TOML/dotted paths, and `multi_agent_v2` remains under development.

## Verification

- `pnpm --filter @pgg/core test`: pass
- `pnpm build`: pass
- `pnpm test`: pass
- `bash -n .codex/sh/pgg-state-pack.sh`: pass
- `codex features list`: pass
- stale routing search: pass

## Residual Risk

- Codex custom role TOML semantics beyond feature flags are not externally documented in the installed CLI output; generated files are therefore kept project-local, declarative, and referenced by pgg orchestration docs instead of assuming a hidden runtime schema.

