# Current Generated Agent Assets

## Purpose

Bring this repository's checked-in generated files and managed file records into the fixed schema/language contract.

## Requirements

- Refresh `.codex/agents/*.toml` from the corrected templates.
- Resolve `.codex/agents/main.toml` according to the S2 decision.
- Update `.pgg/project.json` managed file checksums for changed generated files.
- Update `packages/core/dist/templates.js` and `packages/core/dist/templates.js.map` after source changes.
- Update any generated `.codex/add/*.md`, `.codex/skills/*.md`, `AGENTS.md`, or README surfaces affected by the language-sync contract.
- Preserve existing `poggn/version-history.ndjson`.
- Do not revert unrelated dirty paths captured in `state/dirty-worktree-baseline.txt`.

## Acceptance

- Current generated agent files no longer contain the reported unsupported fields.
- The current project remains registered as `language=ko`.
- Managed file records match the regenerated content after implementation.
- Existing user-owned or unrelated files remain untouched unless explicitly required by this topic.
