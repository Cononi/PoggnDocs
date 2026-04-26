# S1: Codex Config And Teams Sync

## Purpose

Define how pgg manages Codex multi-agent configuration without touching global user configuration directly.

## Requirements

- Create or update `.codex/config.toml` as a pgg-managed project artifact.
- `features.multi_agent` must be derived from `.pgg/project.json` `teamsMode`.
- `teamsMode=on` maps to `features.multi_agent=true`.
- `teamsMode=off` maps to `features.multi_agent=false`.
- Default agent controls are:
  - `agents.max_threads=4`
  - `agents.max_depth=1`
- Preserve user-editable non-pgg config sections when possible.
- Do not modify `~/.codex/config.toml`.

## Compatibility Contract

- Local Codex CLI help identifies `~/.codex/config.toml` as the default runtime config source.
- Local Codex CLI supports dotted `-c key=value` overrides.
- Local Codex CLI treats `--enable <FEATURE>` as `features.<name>=true`.
- Implementation must verify whether project-local `.codex/config.toml` is automatically consumed. If not, it remains a pgg source artifact and runtime application must be documented or done through supported overrides.

## Acceptance

- Tests cover `teamsMode=on` and `teamsMode=off`.
- Tests confirm generated TOML contains the expected boolean and numeric defaults.
- Generated config is included in managed files if pgg update manages it.
- No global config file is written by automated project workflow.
